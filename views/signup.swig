{% extends 'layout.swig' %}

{% block title %} {{ translation.nav.signup }} {% endblock %}

{% block body %}
	<div class="container" layout:fragment="content">
		<h2 th:text="#{signup.header}">{{ translation.signup.header }}</h2>
		<form class="form-horizontal" method="post" action="/signup">
			<div class="form-group">
				<label class="bmd-label-floating" for="email">{{ translation.user.email }}</label>
				<input type="text" id="email" class="form-control" name="email" aria-describedby="basic-addon1" required/>
				{% if error.equals('email') %}
					<span id="email-error" class="text-danger">{{ error.email }}</span>
				{% endif %}
			</div>
			<div class="form-group">
				<label class="bmd-label-floating" for="name">{{ translation.user.name }}</label>
				<input type="text" id="name" class="form-control" name="name" aria-describedby="basic-addon1" required/>
				{% if error.equals('name') %}
					<span id="email-error" class="text-danger">{{ error.name }}</span>
				{% endif %}
				<span id="name-error" class="text-danger"></span>
			</div>
			<div class="form-group">
				<label class="bmd-label-floating" for="lastName">{{ translation.user.lastName }}</label>
				<input type="text" id="lastName" class="form-control" name="lastName" aria-describedby="basic-addon1" required/>
				{% if error.equals('lastName') %}
					<span id="email-error" class="text-danger">{{ error.lastName }}</span>
				{% endif %}
				<span id="lastName-error" class="text-danger"></span>
			</div>
			<div class="form-group">
				<label class="bmd-label-floating" for="password">{{ translation.user.password }}</label>
				<input type="password" id="password" class="form-control" name="password" aria-describedby="basic-addon1" required/>
				{% if true or error.equals('password') %}
					<span id="email-error" class="text-danger">{{ error.password }}</span>
				{% endif %}
				<span id="password-error" class="text-danger"></span>
			</div>
			<div class="form-group">
				<label class="bmd-label-floating" for="passwordConfirm">{{ translation.signup.repitPassword }}</label>
				<input type="password" id="passwordConfirm" class="form-control" name="passwordConfirm" aria-describedby="basic-addon1" required/>
				{% if error.equals('paswordConfirm') %}
					<span id="email-error" class="text-danger">{{ error.passwordConfirm }}</span>
				{% endif %}
				<span id="paswordConfirm-error" class="text-danger"></span>
			</div>
			<div class="form-group">
				<button type="submit" class="btn btn-outline-success waves-effects">{{ translation.util.send }}</button>
			</div>
			<input type="hidden" name="_csrf" value="{{ csrftoken }}"/>
		</form>
	</div>
{% endblock %}
