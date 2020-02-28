from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.urls import reverse
from django.views import generic
from django.template import loader
from django.utils import timezone
from .models import Question, Choice

class IndexView(generic.ListView):
	template_name = 'polls/index.html'
	context_object_name = 'latest_question_list'

	def get_queryset(self):
		"""
		Return the last five publised questions
		(not including the ones set to be published in the future).
		"""
		return Question.objects.filter(
			pub_date__lte=timezone.now()).order_by('-pub_date')[:5]
		
class DetailView(generic.DetailView):
	model = Question
	template_name = 'polls/detail.html'

class ResultsView(generic.DetailView):
	model = Question
	template_name = 'polls/results.html'

def vote(request, pk):
	question = get_object_or_404(Question, pk = pk)
	try:
		selected_choice = question.choice_set.get(pk = request.POST['choice'])
	except (KeyError, Choice.DoesNotExist):
		#Redisplay question voting form.
	    return render(request,'polls/vote.html',{
	    	'question': question,
	    	'error_message': 'Such a question does not seem to exist',
	    	})
	else:
		selected_choice.votes+=1
		selected_choice.save()
		# always return an HttpResponseRedirect after succesfully
		# dealing with POST data. This prevents data from being posted
		# twice if a user hits the Back Button
		return HttpResponseRedirect(reverse('polls:results', args = (question.id,)))

# from django.shortcuts import render, get_object_or_404
# from django.http import HttpResponse, Http404, HttpResponseRedirect
# from django.urls import reverse
# from django.views import generic
# from django.template import loader
# from .models import Question, Choice

# def index(request):
#     latest_question_list = Question.objects.order_by('-pub_date')[:5]
#     context = {
#         'latest_question_list': latest_question_list,
#     }
#     return render(request,'polls/index.html', context)

# def detail(request, question_id):
# 	try:
# 		question = Question.objects.get(pk=question_id)
# 	except Question.DoesNotExist:
# 		raise Http404("Twoj stary jest czarny")
# 	question = get_object_or_404(Question, pk = question_id)
# 	return render(request,'polls/detail.html',{'question': question})

# def results(request, question_id):
# 	question = get_object_or_404(Question, pk = question_id)
# 	return render(request, 'polls/results.html', {'question' : question})

# def vote(request, question_id):
# 	question = get_object_or_404(Question, pk = question_id)
# 	try:
# 		selected_choice = question.choice_set.get(pk= request.POST['choice'])
# 	except (KeyError, Choice.DoesNotExist):
# 		#Redisplay question voting form.
# 	    return render(request,'polls/vote.html',{
# 	    	'question': question,
# 	    	'error_message': 'Twoj Stary :)',
# 	    	})
# 	else:
# 		selected_choice.votes+=1
# 		selected_choice.save()
# 		# always return an HttpResponseRedirect after succesfully
# 		# dealing with POST data. This prevents data from being posted
# 		# twice if a user hits the Back Button
# 		return HttpResponseRedirect(reverse('polls:results',args= (question.id,)))