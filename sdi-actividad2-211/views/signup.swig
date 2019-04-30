{% extends 'layout.swig' %}

{% block title %} {{ __("nav.signup") }} {% endblock %}

{% block body %}
	<div class="container" layout:fragment="content">
		<h2>{{ __("signup.header") }}</h2>
		<form class="form-horizontal" method="post" action="/signup">
			<div class="form-group">
				<label class="bmd-label-floating" for="email">{{ __("user.email") }}</label>
				<input type="text" id="email" class="form-control" name="email" aria-describedby="basic-addon1" required/>
			</div>
			<div class="form-group">
				<label class="bmd-label-floating" for="name">{{ __("user.name") }}</label>
				<input type="text" id="name" class="form-control" name="name" aria-describedby="basic-addon1" required/>
				<span id="name-error" class="text-danger"></span>
			</div>
			<div class="form-group">
				<label class="bmd-label-floating" for="lastName">{{ __("user.lastName") }}</label>
				<input type="text" id="lastName" class="form-control" name="lastName" aria-describedby="basic-addon1" required/>
				<span id="lastName-error" class="text-danger"></span>
			</div>
			<div class="form-group">
				<label class="bmd-label-floating" for="password">{{ __("user.password") }}</label>
				<input type="password" id="password" class="form-control" name="password" aria-describedby="basic-addon1" required/>
				<span id="password-error" class="text-danger"></span>
			</div>
			<div class="form-group">
				<label class="bmd-label-floating" for="passwordConfirm">{{ __("signup.repitPassword") }}</label>
				<input type="password" id="passwordConfirm" class="form-control" name="passwordConfirm" aria-describedby="basic-addon1" required/>
				<span id="paswordConfirm-error" class="text-danger"></span>
			</div>
			<div class="form-group">
				<button type="submit" class="btn btn-outline-success waves-effects">{{ __("util.send") }}</button>
			</div>
			{% if error %}
				<div id="signup-error" class="alert alert-danger">{{ error }}</div>
			{% endif %}

			<input type="hidden" name="_csrf" value="{{ csrftoken }}"/>
		</form>
	</div>
{% endblock %}
