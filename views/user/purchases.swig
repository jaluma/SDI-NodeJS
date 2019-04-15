{% extends '../layout.swig' %}

{% block title %} {{ __("nav.sells.bought") }} {% endblock %}

{% block body %}
	<div class="container">
		<h2 th:text="#{nav.sells.bought}">{{ __("nav.sells.bought") }}</h2>

		<div class="table-responsive card-body">
			<h3>{{ __("user.buyed.list", currentUser.fullName) }}</h3>
			<table id="tableItems" class="table table-hover">
				<thead>
				<tr>
					<th>{{ __("item.title") }}</th>
					<th>{{ __("item.description") }}</th>
					<th>{{ __("item.price") }}</th>
				</tr>
				</thead>
				<tbody>
				{% for item in itemsList %}
					<tr class="tr-static-height clickable-row" data-href="{{ '/item/details/' + item._id }}" style="cursor: pointer;">
						<td>{{ item.title }}</td>
						<td>{{ item.description }}</td>
						<td>{{ item.price }}</td>
					</tr>
				{% endfor %}
				</tbody>
			</table>

			{% include '../fragments/pagination.swig' %}

			<script th:inline="javascript">
                /*<![CDATA[*/
                let rows = $("#tableItems tr").length - 1;
                let value = 460 - (rows * 46);
                document.getElementById('tableItems').style.marginBottom = value + ".px";
                /*]]>*/
			</script>
		</div>
	</div>
{% endblock %}
