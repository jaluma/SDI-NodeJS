<!DOCTYPE html>
<html lang="es">
<head>
	{% block head %}{% include 'fragments/head.swig' %} {% endblock %}
	<title>MyWallapop - {% block title %}{% endblock %}</title>
	{% block scripts %} {% endblock %}
</head>
<body>
{% block nav %}{% include './fragments/nav.swig' %}{% endblock %}
{% block body %}{% endblock %}
{% block footer %}{% include 'fragments/footer.swig' %}{% endblock %}
</body>
</html>
