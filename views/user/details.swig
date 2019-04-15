{% extends '../layout.swig' %}

{% block title %} {{ __("user.details.header") }} {% endblock %}

{% block body %}
	<div class="container">
		<div class="card block mb-3 w-100">
			<div class="card-body">
				<h2 class="card-title">{{ __("user.email") }}</h2>
				<p class="card-text">{{ user.email }}</p>
			</div>
		</div>
		<div class="card block mb-3 w-100">
			<div class="card-body">
				<h2 class="card-title">{{ __("user.name") }}</h2>
				<p class="card-text">{{ user.fullName }}</p>
			</div>
		</div>
		<div class="card block mb-3 w-100">
			<div class="card-body">
				<h2 class="card-title">{{ __("user.money") }}</h2>
				<p class="card-text">{{ user.money }}</p>
			</div>
		</div>
	</div>
{% endblock %}
