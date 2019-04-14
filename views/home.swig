{% extends 'layout.swig' %}

{% block title %} {{ translation.nav.home }} {% endblock %}

{% block body %}
	<div class="container">
		<div class="row text-center">
			<div id="personal-area" class="col-sm-5 mb-3">
				<div class="card" style="height: 100%">
					<div class="card-body text-center">
						<img class="card-img-top rounded-circle z-depth-0" style="max-width: 200px"
						     src="http://icons.iconarchive.com/icons/papirus-team/papirus-status/256/avatar-default-icon.png"
						     alt="Card image cap">
						<h2 class="card-title card-title-pro">{{ translation.welcome.message }}</h2>
						<h3>{{ currentUser.fullName }}</h3>
						<a th:href="${'/user/details/' + currentUser.getId()}" class="btn btn-primary link">{{ translation.home.user.personal }}</a>
					</div>
				</div>
			</div>

			{% if currentUser.role === "STANDARD_ROLE" %}
				<div id="highlighter_table" class="col-sm-7 mb-3" sec:authorize="hasRole('ROLE_STANDARD')">
					{% if hightlighter_items!== null and hightlighter_items.length > 0 %}
						<div class="card" style="width: 100%; height: 100%">
							<h2 class="card-title card-title-pro">{{ translation.home.highlighter }}</h2>
							<table id="tableItems" class="table table-hover">
								<thead>
								<tr>
									<th>{{ translation.item.title }}</th>
									<th>{{ translation.item.description }}</th>
									<th>{{ translation.item.price }}</th>
								</tr>
								</thead>
								<tbody>
								<tr class="tr-static-height">
									{% for item in hightlighter_items %}
										<td class="clickable-row" data-href="/item/details/' + {{ item.id }}">{{ item.title }}</td>
										<td class="clickable-row" data-href="/item/details/' + {{ item.id }}">{{ item.description }}</td>
										<td class="clickable-row" data-href="/item/details/' + {{ item.id }}">{{ item.price }}</td>
									{% endfor %}
								</tr>
								</tbody>
							</table>
						</div>
					{% endif %}
				</div>
			{% endif %}
		</div>

		<div class="mb-3 text-center">
			{% if currentUser.role === "STANDARD_ROLE" %}
				<div class="col-sm-12">
				<div class="card" style="height: 100%">
					<h2 class="card-title card-title-pro">{{ translation.nav.sales.mySales }}</h2>
					{#					<div th:replace="item/mylist :: tableItems" class="card block"></div>#}
				</div>
			</div>
			{% endif %}
		</div>
	</div>
{% endblock %}
