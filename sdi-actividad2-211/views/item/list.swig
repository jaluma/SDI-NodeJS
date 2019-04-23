{% extends '../layout.swig' %}

{% block title %} {{ __("sell.list.title") }} {% endblock %}

{% block body %}
	<div class="container">
		<h2>{{ __("sell.list.header") }}</h2>

		<div class="table-responsive">

			{% include '../fragments/search.swig' %}

			<table id="tableItems" class="table table-hover">
				<thead>
				<tr>
					<th th:text="#{item.title}">{{ __("item.title") }}</th>
					<th th:text="#{item.description}">{{ __("item.description") }}</th>
					<th th:text="#{item.price}">{{ __("item.price") }}</th>
					<th></th>
					<th></th>
				</tr>
				</thead>
				<tbody>
				{% for item in itemsList %}
					<tr class="tr-static-height">
						<td class="align-middle clickable-row" data-href="{{ '/item/details/' + item._id }}">{{ item.title }}</td>
						<td class="align-middle clickable-row" data-href="{{ '/item/details/' + item._id }}">{{ item.description }}</td>
						<td class="align-middle clickable-row" data-href="{{ '/item/details/' + item._id }}">{{ item.price }}</td>
						{% if item.buyerUser === null %}
							<td class="align-middle clickable-row" data-href="{{ '/item/details/' + item._id }}">
								<a id="buyButton" class="btn btn-secondary link" href="{{ '/item/buy/' + item._id }}">{{ __("item.buy") }}</a>
								<a id="chatButton" class="btn btn-secondary link" href="{{ '/chat/create/' + item.id }}">{{ __("chat.contact") }}</a>
							</td>
						{% else %}
							<td class="align-middle">
								<span class="btn btn-secondary link disabled">{{ __("item.buyed") }}</span>
							</td>
						{% endif %}
					</tr>
				{% endfor %}
				</tbody>
			</table>

			{% include '../fragments/pagination.swig' %}

			{% if error %}
				<div id="money-error" class="alert alert-danger">{{ __("item.buy.insuficient") }}</div>
			{% endif %}

			<script th:inline="javascript">
                /*<![CDATA[*/
                let rows = $('#tableItems tr').length - 1;
                let value = (5 * 66) - (rows * 66) + 15;
                document.getElementById('tableItems').style.marginBottom = value + ".px";
                /*]]>*/
			</script>
		</div>
	</div>
{% endblock %}
