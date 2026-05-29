import json
import logging
from django.conf import settings

logger = logging.getLogger(__name__)


class FeedbackService:

    @classmethod
    def evaluate(cls, question, user_answer: str) -> dict:
        result = cls._evaluate_with_ai(question, user_answer)
        if not result:
            result = cls._evaluate_locally(question, user_answer)
        return result

    @classmethod
    def _evaluate_with_ai(cls, question, user_answer: str):
        if not settings.OPENAI_API_KEY:
            return None
        try:
            from openai import OpenAI
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            prompt = (
                f"You are a senior software engineer conducting a technical interview.\n\n"
                f"Question: {question.text}\n"
                f"Expected keywords: {', '.join(question.expected_keywords)}\n"
                f"Candidate's answer: {user_answer}\n\n"
                f"Evaluate the answer. Return ONLY JSON:\n"
                f"{{\"score\": float (0-10), \"strengths\": string, \"improvements\": string, \"model_answer\": string}}\n"
                f"Be constructive, specific, and concise."
            )
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=600,
                temperature=0.4,
            )
            raw = response.choices[0].message.content.strip()
            return json.loads(raw)
        except Exception as e:
            logger.warning(f"OpenAI feedback failed: {e}")
            return None

    @classmethod
    def _evaluate_locally(cls, question, user_answer: str) -> dict:
        """Keyword-based fallback when OpenAI is unavailable."""
        keywords = question.expected_keywords or []
        answer_lower = user_answer.lower()
        matched = [kw for kw in keywords if kw.lower() in answer_lower]
        ratio = len(matched) / len(keywords) if keywords else 0.5
        score = round(min(10.0, max(1.0, ratio * 10)), 1)

        if ratio >= 0.7:
            strengths = "Good coverage of key concepts. Your answer demonstrates solid understanding."
        elif ratio >= 0.4:
            strengths = "Partially correct. You touched on some important points."
        else:
            strengths = "You made an attempt. Keep practicing."

        missing = [kw for kw in keywords if kw.lower() not in answer_lower]
        improvements = (
            f"Consider expanding on: {', '.join(missing[:3])}." if missing
            else "Try to be more specific with examples."
        )
        return {
            'score': score,
            'strengths': strengths,
            'improvements': improvements,
            'model_answer': f"A strong answer would cover: {', '.join(keywords)}.",
        }
