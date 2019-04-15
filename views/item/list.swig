{% extends '../layout.swig' %}

{% block title %} {{ translation.sell.list.title }} {% endblock %}

{% block body %}
	<div class="container">
		<h2 th:text="#{sell.list.header}">{{ translation.sell.list.header }}</h2>

		<div class="table-responsive">
			<table id="tableItems" class="table table-hover">
				<thead>
				<tr>
					<th th:text="#{item.title}">{{ translation.item.title }}</th>
					<th th:text="#{item.description}">{{ translation.item.description }}</th>
					<th th:text="#{item.price}">{{ translation.item.price }}</th>
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
								<a id="buyButton" class="btn btn-secondary link" href="{{ '/item/buy/' + item._id }}">{{ translation.item.buy }}</a>
								<a id="chatButton" class="btn btn-secondary link"
								   href="{{ '/chat/create/' + item.id }}">{{ translation.item.contact }}</a>
							</td>
						{% else %}
							<td class="align-middle">
								<span class="btn btn-secondary link disabled">{{ translation.item.buyed }}</span>
							</td>
						{% endif %}
					</tr>
				{% endfor %}
				</tbody>
			</table>
			<footer th:replace="fragments/pagination"></footer>
			{% if error %}
				<div id="money-error" class="alert alert-danger" th:text="#{${buy}}">{{ translation.item.buy.insuficient }}</div>
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
