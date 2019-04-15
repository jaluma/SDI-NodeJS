{% extends 'layout.swig' %}

{% block title %} Inicio {% endblock %}

{% block body %}

	<div class="container" style="text-align: center">
		<h2>{{ __("welcome.message") }}</h2>

		{% if currentUser === null %}
			<div class="col-sm-5" style="display: inline-block;">
				<div class="card jumbotron jumbotron_flex">
					<div class="card-body" style="text-align: center">
						<h4>{{ __("index.signup") }}</h4>
						<a href="/login" class="btn btn-primary link">{{ __("login.header") }}</a>
					</div>
				</div>
			</div>

			<div class="col-sm-5" style="display: inline-block;">
				<div class="card jumbotron jumbotron_flex">
					<div class="card-body" style="text-align: center">
						<h4>{{ __("index.new") }}</h4>
						<a href="/signup" class="btn btn-primary link">{{ __("nav.signup") }}</a>
					</div>
				</div>
			</div>
		{% else %}
			<div class="card jumbotron">
				<div class="card-body" style="text-align: center">
					<h2>{{ __("index.searching") }}</h2>
					<hr class="my-4">
					<a href="/home" class="btn btn-primary link">{{ __("nav.home") }}</a>
					<a href="{{ '/user/details/' + currentUser._id }}"
					   class="btn btn-primary link">{{ __("index.user.details") }}</a>
				</div>
			</div>
		{% endif %}
	</div>

{% endblock %}
