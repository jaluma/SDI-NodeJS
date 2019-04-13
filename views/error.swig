{% extends 'layout.swig' %}

{% block body %}
	<div class="container">
		<h1 class="alert alert-danger text-center">
			<i class="material-icons">error</i>
			<span>{{ error.status }} - {{ message }}</span>
		</h1>

		<pre>{{ error.stack }}</pre>

		<p class="text-center align-middle">
			<a class="btn btn-outline-danger btn-lg" href="/">
				<i class="material-icons align-middle">home</i>
				<span class="align-middle" text="#{error.go_home}"></span>
			</a>
		</p>
	</div>
{% endblock %}
