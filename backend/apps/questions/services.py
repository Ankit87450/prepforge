import random
import json
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

ROLE_TOPIC_MAP = {
    'frontend': ['react', 'javascript', 'oops', 'dsa', 'behavioral'],
    'backend': ['python', 'django', 'dbms', 'dsa', 'system_design'],
    'fullstack': ['react', 'django', 'dsa', 'dbms', 'system_design'],
    'swe': ['dsa', 'oops', 'system_design', 'os', 'behavioral'],
    'dsa': ['dsa', 'dsa', 'dsa', 'oops', 'python'],
}

FALLBACK_QUESTIONS = {
    'dsa': [
        {'text': 'Explain the difference between BFS and DFS. When would you prefer one over the other?', 'keywords': ['queue', 'stack', 'graph', 'traversal', 'shortest path']},
        {'text': 'What is dynamic programming? Explain with an example like Fibonacci or Knapsack.', 'keywords': ['memoization', 'tabulation', 'overlapping subproblems', 'optimal substructure']},
        {'text': 'How does a HashMap work internally? What happens during a collision?', 'keywords': ['hashing', 'buckets', 'chaining', 'open addressing', 'load factor']},
        {'text': 'What is the difference between a stack and a queue? Give real-world use cases for each.', 'keywords': ['LIFO', 'FIFO', 'recursion', 'scheduling', 'undo']},
        {'text': 'Explain binary search. What are its time and space complexities and when can you apply it?', 'keywords': ['sorted', 'O(log n)', 'mid', 'divide', 'monotonic']},
        {'text': 'What is a linked list? Compare it with an array in terms of insertion, deletion, and access.', 'keywords': ['pointer', 'node', 'O(1) insertion', 'O(n) access', 'dynamic size']},
    ],
    'react': [
        {'text': 'Explain the React component lifecycle with hooks. How does useEffect replace lifecycle methods?', 'keywords': ['componentDidMount', 'componentDidUpdate', 'cleanup', 'dependency array']},
        {'text': 'What is the Virtual DOM and how does React reconciliation work?', 'keywords': ['diffing', 'fiber', 'rerender', 'key prop']},
        {'text': 'What is the difference between controlled and uncontrolled components in React?', 'keywords': ['state', 'ref', 'onChange', 'defaultValue', 'form']},
        {'text': 'Explain React Context API. When would you use it over prop drilling?', 'keywords': ['createContext', 'useContext', 'Provider', 'global state', 'prop drilling']},
        {'text': 'What are React custom hooks? Write an example of a useFetch hook.', 'keywords': ['reusability', 'useState', 'useEffect', 'abstraction', 'fetch']},
        {'text': 'What is the difference between useMemo and useCallback? When should you use each?', 'keywords': ['memoization', 'performance', 'referential equality', 'dependency', 'rerender']},
    ],
    'django': [
        {'text': "How does Django's ORM handle database queries? Explain select_related vs prefetch_related.", 'keywords': ['JOIN', 'N+1 problem', 'lazy loading', 'eager loading']},
        {'text': "Explain Django's middleware pipeline and how you would write a custom middleware.", 'keywords': ['request', 'response', 'process_request', 'process_response', 'order']},
        {'text': 'What is Django REST Framework? Explain serializers and when you would use ModelSerializer.', 'keywords': ['serializer', 'validation', 'ModelSerializer', 'fields', 'create', 'update']},
        {'text': 'How does Django handle authentication and authorization? What is the difference between the two?', 'keywords': ['authentication', 'authorization', 'permissions', 'login', 'is_authenticated']},
        {'text': 'Explain Django signals. Give a practical example of when you would use post_save.', 'keywords': ['signal', 'receiver', 'post_save', 'pre_delete', 'decoupling']},
        {'text': 'What are Django migrations? How do you handle a migration conflict in a team setting?', 'keywords': ['makemigrations', 'migrate', 'schema', 'conflict', 'squash']},
    ],
    'system_design': [
        {'text': 'Design a URL shortener like bit.ly. Walk through your choices for storage, hashing, and scaling.', 'keywords': ['hashing', 'base62', 'cache', 'database', 'CDN', 'load balancer']},
        {'text': 'How would you design a notification system that handles millions of users?', 'keywords': ['queue', 'pub-sub', 'kafka', 'push', 'fan-out', 'rate limiting']},
        {'text': 'Explain horizontal vs vertical scaling. When would you choose one over the other?', 'keywords': ['vertical scaling', 'horizontal scaling', 'load balancer', 'stateless', 'cost']},
        {'text': 'What is a CDN and how does it improve performance? When would you not use one?', 'keywords': ['edge server', 'latency', 'cache', 'static assets', 'origin server']},
        {'text': 'Design a rate limiter. What algorithms would you consider and what are their trade-offs?', 'keywords': ['token bucket', 'sliding window', 'fixed window', 'Redis', 'distributed']},
    ],
    'behavioral': [
        {'text': 'Tell me about a time you had a disagreement with a teammate. How did you resolve it?', 'keywords': ['communication', 'empathy', 'outcome', 'compromise']},
        {'text': 'Describe a project where you had to learn a new technology quickly. How did you approach it?', 'keywords': ['learning', 'documentation', 'practice', 'deadline', 'adapt']},
        {'text': 'Tell me about a bug you spent a long time debugging. What was your process?', 'keywords': ['systematic', 'logs', 'reproduce', 'isolate', 'fix']},
        {'text': 'Describe a situation where you had to balance multiple tasks with competing deadlines.', 'keywords': ['prioritization', 'communication', 'time management', 'trade-off']},
    ],
    'oops': [
        {'text': 'Explain the four pillars of OOP with real-world examples.', 'keywords': ['encapsulation', 'abstraction', 'inheritance', 'polymorphism']},
        {'text': 'What is the difference between an abstract class and an interface? When would you use each?', 'keywords': ['abstract', 'interface', 'multiple inheritance', 'contract', 'implementation']},
        {'text': 'Explain the SOLID principles. Give an example of violating and then fixing the Single Responsibility Principle.', 'keywords': ['single responsibility', 'open closed', 'Liskov', 'interface segregation', 'dependency inversion']},
        {'text': 'What is method overloading vs method overriding? How does Python handle overloading?', 'keywords': ['compile time', 'runtime', 'polymorphism', 'super', 'default arguments']},
    ],
    'dbms': [
        {'text': 'What are ACID properties? Explain each with an example.', 'keywords': ['atomicity', 'consistency', 'isolation', 'durability', 'transaction']},
        {'text': 'What is database normalization? Explain 1NF, 2NF, and 3NF with examples.', 'keywords': ['1NF', '2NF', '3NF', 'redundancy', 'dependency', 'decomposition']},
        {'text': 'What is the difference between SQL and NoSQL databases? When would you choose each?', 'keywords': ['relational', 'schema', 'scalability', 'document', 'consistency', 'flexibility']},
        {'text': 'Explain database indexing. What are the trade-offs of adding too many indexes?', 'keywords': ['B-tree', 'search speed', 'write overhead', 'composite index', 'query planner']},
        {'text': 'What is a database transaction? Explain deadlocks and how to prevent them.', 'keywords': ['lock', 'deadlock', 'rollback', 'isolation level', 'timeout']},
    ],
    'python': [
        {'text': 'What is the GIL in Python? How does it affect multithreading vs multiprocessing?', 'keywords': ['Global Interpreter Lock', 'threading', 'concurrency', 'CPU-bound', 'I/O-bound']},
        {'text': 'Explain Python decorators. Write a simple decorator that logs function execution time.', 'keywords': ['wrapper', 'functools', 'higher order function', 'closure', '@']},
        {'text': 'What are Python generators? How are they different from regular functions and lists?', 'keywords': ['yield', 'lazy evaluation', 'memory', 'iterator', 'next']},
        {'text': 'Explain the difference between shallow copy and deep copy in Python.', 'keywords': ['copy', 'deepcopy', 'reference', 'nested', 'mutation']},
        {'text': 'What are Python context managers? How do you implement one using __enter__ and __exit__?', 'keywords': ['with statement', '__enter__', '__exit__', 'resource management', 'exception']},
    ],
    'os': [
        {'text': 'Explain the difference between a process and a thread. What is a context switch?', 'keywords': ['PCB', 'scheduling', 'memory', 'overhead', 'concurrency']},
        {'text': 'What is virtual memory? How does paging work?', 'keywords': ['page table', 'physical memory', 'page fault', 'swap', 'address space']},
        {'text': 'Explain deadlock. What are the four conditions required for a deadlock to occur?', 'keywords': ['mutual exclusion', 'hold and wait', 'no preemption', 'circular wait', 'prevention']},
        {'text': 'What is the difference between process scheduling algorithms: FCFS, SJF, and Round Robin?', 'keywords': ['burst time', 'waiting time', 'starvation', 'time quantum', 'preemptive']},
    ],
    'networking': [
        {'text': 'What happens when you type a URL in the browser? Walk through the full request lifecycle.', 'keywords': ['DNS', 'TCP', 'HTTP', 'TLS', 'server', 'response']},
        {'text': 'Explain the difference between TCP and UDP. When would you choose UDP?', 'keywords': ['reliable', 'connection', 'handshake', 'streaming', 'packet loss']},
        {'text': 'What is REST? What are the key constraints that make an API RESTful?', 'keywords': ['stateless', 'uniform interface', 'HTTP methods', 'resource', 'idempotent']},
        {'text': 'What is the difference between HTTP and HTTPS? How does TLS work at a high level?', 'keywords': ['encryption', 'certificate', 'handshake', 'public key', 'SSL']},
    ],
    'javascript': [
        {'text': 'Explain the JavaScript event loop, call stack, and microtask queue.', 'keywords': ['asynchronous', 'promises', 'setTimeout', 'microtask', 'macrotask']},
        {'text': 'What is closure in JavaScript? Give a practical example.', 'keywords': ['scope', 'lexical environment', 'private variable', 'function factory', 'reference']},
        {'text': 'Explain the difference between == and === in JavaScript. When does type coercion happen?', 'keywords': ['strict equality', 'type coercion', 'NaN', 'null', 'undefined']},
        {'text': 'What is the difference between var, let, and const? Explain hoisting.', 'keywords': ['block scope', 'function scope', 'hoisting', 'temporal dead zone', 'reassignment']},
        {'text': 'What are Promises in JavaScript? How does async/await improve on them?', 'keywords': ['then', 'catch', 'async', 'await', 'error handling', 'chaining']},
    ],
}


class QuestionGeneratorService:

    @classmethod
    def generate_for_interview(cls, interview):
        from apps.questions.models import Question

        topics = list(ROLE_TOPIC_MAP.get(interview.role, ROLE_TOPIC_MAP['swe']))
        random.shuffle(topics)
        questions_data = cls._fetch_from_ai(interview) or cls._get_fallback(topics, interview.total_questions)

        for idx, q in enumerate(questions_data[:interview.total_questions], start=1):
            Question.objects.create(
                interview=interview,
                topic=q.get('topic', topics[idx % len(topics)]),
                text=q['text'],
                expected_keywords=q.get('keywords', []),
                order=idx,
            )

    @classmethod
    def _fetch_from_ai(cls, interview):
        if not settings.OPENAI_API_KEY:
            return None
        try:
            from openai import OpenAI
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            topics = ROLE_TOPIC_MAP.get(interview.role, ROLE_TOPIC_MAP['swe'])
            prompt = (
                f"Generate {interview.total_questions} {interview.difficulty} technical interview questions "
                f"for a {interview.get_role_display()} role. Cover these topics: {', '.join(topics)}. "
                f"Return ONLY a JSON array. Each element: {{\"topic\": string, \"text\": string, \"keywords\": [string]}}. "
                f"No extra text, no markdown."
            )
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=1500,
                temperature=0.7,
            )
            raw = response.choices[0].message.content.strip()
            return json.loads(raw)
        except Exception as e:
            logger.warning(f"OpenAI question generation failed: {e}")
            return None

    @classmethod
    def _get_fallback(cls, topics, count):
        questions = []
        for topic in topics:
            bank = FALLBACK_QUESTIONS.get(topic, [])
            for q in bank:
                questions.append({'topic': topic, 'text': q['text'], 'keywords': q['keywords']})
        random.shuffle(questions)
        return questions[:count]