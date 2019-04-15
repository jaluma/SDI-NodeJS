{% extends '../layout.swig' %}

{% block title %} {{ translation.item.details.header }} {% endblock %}

{% block body %}
	<div class="container">
		<div class="card block mb-3 w-100">
			<div class="card-body">
				<h2 class="card-title">{{ translation.item.title }}</h2>
				<p class="card-text">{{ item.title }}</p>
			</div>
		</div>
		<div class="card block mb-3 w-100">
			<div class="card-body">
				<h2 class="card-title">{{ translation.item.description }}</h2>
				<p class="card-text">{{ item.description }}</p>
			</div>
		</div>
		<div class="card block mb-3 w-100">
			<div class="card-body">
				<h2 class="card-title">{{ translation.item.price }}</h2>
				<p class="card-text">{{ item.price }}</p>
			</div>
		</div>
		<div class="card block mb-3 w-100">
			<div class="card-body">
				<h2 class="card-title">{{ translation.item.seller }}</h2>
				<p class="card-text">{{ item.sellerUser.fullName }}</p>
			</div>
		</div>
	</div>
{% endblock %}
