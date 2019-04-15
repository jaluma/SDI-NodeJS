{% extends 'layout.swig' %}

{% block title %} {{ __("login.header") }} {% endblock %}

{% block body %}
	<div class="container">
		<h2>{{ __("nav.login") }}</h2>
		<form class="form-horizontal" method="post" action="/login">
			<div class="form-group">
				<label class="control-label col-sm-2" for="email">{{ __("user.email") }}</label>
				<input id="email" type="text" class="form-control" name="email" required/>
			</div>
			<div class="form-group">
				<label class="control-label col-sm-2" for="password">{{ __("user.password") }}</label>
				<input id="password" type="password" class="form-control" name="password" required/>
			</div>
			<div class="form-group">
				<button id="login-button" type="submit" class="btn btn-outline-success waves-effect">{{ __("nav.login") }}</button>
			</div>

			{% if error %}
				<div id="login-error" class="alert alert-danger">{{ __("error.signup.login.incorrect") }}</div>
			{% endif %}

			<input type="hidden" name="_csrf" value="{{ csrftoken }}"/>
		</form>
	</div>
{% endblock %}
