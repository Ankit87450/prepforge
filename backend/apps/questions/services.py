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
    ],
    'react': [
        {'text': 'Explain the React component lifecycle with hooks. How does useEffect replace lifecycle methods?', 'keywords': ['componentDidMount', 'componentDidUpdate', 'cleanup', 'dependency array']},
        {'text': 'What is the Virtual DOM and how does React reconciliation work?', 'keywords': ['diffing', 'fiber', 'rerender', 'key prop']},
    ],
    'django': [
        {'text': 'How does Django\'s ORM handle database queries? Explain select_related vs prefetch_related.', 'keywords': ['JOIN', 'N+1 problem', 'lazy loading', 'eager loading']},
        {'text': 'Explain Django\'s middleware pipeline and how you would write a custom middleware.', 'keywords': ['request', 'response', 'process_request', 'process_response', 'order']},
    ],
    'system_design': [
        {'text': 'Design a URL shortener like bit.ly. Walk through your choices for storage, hashing, and scaling.', 'keywords': ['hashing', 'base62', 'cache', 'database', 'CDN', 'load balancer']},
    ],
    'behavioral': [
        {'text': 'Tell me about a time you had a disagreement with a teammate. How did you resolve it?', 'keywords': ['communication', 'empathy', 'outcome', 'compromise']},
    ],
    'oops': [
        {'text': 'Explain the four pillars of OOP with real-world examples.', 'keywords': ['encapsulation', 'abstraction', 'inheritance', 'polymorphism']},
    ],
    'dbms': [
        {'text': 'What are ACID properties? Explain each with an example.', 'keywords': ['atomicity', 'consistency', 'isolation', 'durability', 'transaction']},
    ],
    'python': [
        {'text': 'What is the GIL in Python? How does it affect multithreading vs multiprocessing?', 'keywords': ['Global Interpreter Lock', 'threading', 'concurrency', 'CPU-bound', 'I/O-bound']},
    ],
    'os': [
        {'text': 'Explain the difference between a process and a thread. What is a context switch?', 'keywords': ['PCB', 'scheduling', 'memory', 'overhead', 'concurrency']},
    ],
    'networking': [
        {'text': 'What happens when you type a URL in the browser? Walk through the full request lifecycle.', 'keywords': ['DNS', 'TCP', 'HTTP', 'TLS', 'server', 'response']},
    ],
    'javascript': [
        {'text': 'Explain the JavaScript event loop, call stack, and microtask queue.', 'keywords': ['asynchronous', 'promises', 'setTimeout', 'microtask', 'macrotask']},
    ],
}


class QuestionGeneratorService:

    @classmethod
    def generate_for_interview(cls, interview):
        from apps.questions.models import Question

        topics = ROLE_TOPIC_MAP.get(interview.role, ROLE_TOPIC_MAP['swe'])
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
                if len(questions) >= count:
                    return questions
        return questions[:count]
