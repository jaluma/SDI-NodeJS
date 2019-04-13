<!DOCTYPE html>
<html lang="en">
<head>
	{% block head %}{% include 'fragments/head.swig' %}{% endblock %}
	<title> {{ page_title }} </title>
</head>
<body>
{% block nav %}{% include './fragments/nav.swig' %}{% endblock %}
{% block body %}{% endblock %}
{% block footer %}{% include 'fragments/footer.swig' %}{% endblock %}
</body>
</html>
