{% extends '../layout.swig' %}

{% block title %} {{ translation.nav.sales.add }} {% endblock %}

{% block body %}

	<div class="container">
		<h2>{{ translation.item.add.header }}</h2>
		<form class="form-horizontal" method="post" action="/item/add">
			<div class="form-group">
				<label class="bmd-label-floating" for="title">{{ translation.item.title }}</label>
				<input type="text" id="title" class="form-control" name="title" required/>
				{#            <span id="title-error" class="text-danger" th:if="$#}{#fields.hasErrors('title')}" th:errors="*{title}"></span>#}
			</div>
			<div class="form-group">
				<label class="bmd-label-floating" for="description">{{ translation.item.description }}</label>
				<textarea id="description" class="form-control" name="description" required></textarea>
				{#            <span id="description-error" class="text-danger" th:if="$#}{#fields.hasErrors('description')}" th:errors="*{description}"></span>#}
			</div>
			<div class="form-group">
				<label class="bmd-label-floating" for="date">{{ translation.item.date }}</label>
				<input type="date" id="date" class="form-control" min="{{ now |date("Y-m-d") }}" value="{{ now |date("Y-m-d") }}" name="date"
				       required/>
				{#            <span id="date-error" class="text-danger" th:if="$#}{#fields.hasErrors('dateFormat')}" th:errors="*{dateFormat}"></span>#}
			</div>
			<div class="form-group">
				<label class="bmd-label-floating" for="price">{{ translation.item.price }}</label>
				<input type="number" step="0.01" min="0" id="price" class="form-control" name="price" required/>
				{#            <span id="price-error" class="text-danger" th:if="$#}{#fields.hasErrors('price')}" th:errors="*{price}"></span>#}
			</div>
			<div class="form-check">
				<input type="checkbox" id="highlighter" class="form-check-input" name="highlighter" checked/>
				<label for="highlighter" class="form-check-label">{{ translation.item.highlighter.body }}</label>
			</div>
			<div class="form-group mt-3">
				<div class="col-sm-offset-2 col-sm-10">
					<button id="addButton" type="submit" class="btn btn-outline-success waves-effects">{{ translation.util.send }}</button>
				</div>
			</div>
		</form>
	</div>
{% endblock %}
