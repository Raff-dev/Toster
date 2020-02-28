from django.test import TestCase

# Create your tests here.
import datetime
from django.test import TestCase
from django.utils import timezone
from django.urls import reverse
from .models import Question

class QuestionModelTests(TestCase):

    def test_was_published_recently_with_future_question(self):
        time = timezone.now() + datetime.timedelta(days=30)
        future_question = Question(pub_date = time)
        self.assertIs(future_question.was_published_recently(),False)
    
    def test_was_recently_publiwhed_with_old_question(self):
        time = timezone.now() + datetime.timedelta(days=1,seconds=1)
        old_question = Question(pub_date = time)
        self.assertIs(old_question.was_published_recently(),False)

    def test_was_recently_publiwhed_with_recent_question(self):
        time = timezone.now() + datetime.timedelta(hours=23,minutes=59,seconds=59)
        recent_question = Question(pub_date = time)
        self.assertIs(recent_question.was_published_recently(),True)

def create_question(question_text, days):
    """
    create a question with the given text and publisteg the given number of days offset to now 
    (negatife for questions published in the past).
    """
class QuestionIndexViewTests(TestCase):

    def test_no_questions(self):
        response = self.client.get(reverse('polls:index'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response,"Twoj stary gdzies spierdolil, lol XD")
        self.assertQuerysetEqual(response.context['latest_question_list'], [])
    
    def test_past_question(self):
        create_question(question_text="Past Question.", days = -30)
        response = self.client.get(reverse('polls:index'))
        self.assertQuerysetEqual(
            response.context['latest_questions_list'],
            ['Question: Past question.>']
            )

