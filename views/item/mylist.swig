{% extends '../layout.swig' %}

{% block title %} {{ __("sell.mylist.title") }} {% endblock %}

{% block body %}

	<div class="container">
		<h2>{{ __("sell.mylist.header") }}</h2>

		<div class="table-responsive card-body">
			<table id="tableItems" class="table table-hover">
				<thead>
				<tr>
					<th>{{ __("item.title") }}</th>
					<th>{{ __("item.description") }}</th>
					<th>{{ __("item.price") }}</th>
					<th></th>
				</tr>
				</thead>
				<tbody>
				{% for item in itemsList %}
					<tr class="tr-static-height">
						<td class="clickable-row" data-href="{{ '/item/details/' + item._id }}">{{ item.title }}</td>
						<td class="clickable-row" data-href="{{ '/item/details/' + item._id }}">{{ item.description }}</td>
						<td class="clickable-row" data-href="{{ '/item/details/' + item._id }}">{{ item.price }}</td>
						<td><a id="delete" class="link" href="{{ '/item/delete/' + item._id }}"><i class="material-icons">delete</i></a></td>
						<td>
							{% if item.highlighter !== true and item.buyerUser === null %}
								<a class="hightlighter link" id="{{ '/item/highlighter/' + item._id }}" data-toggle="modal" data-target="#modal"
								   title="{{ __("tooltip.hightlighter") }}" style="cursor: pointer">
									<i class="material-icons">offline_bolt</i>
								</a>
							{% elseif item.highlighter === true and item.buyerUser === null %}
								<a class="hightlighter-disabled disabled">
									<i class="material-icons">offline_bolt</i>
								</a>
							{% else %}
								<span class="btn btn-secondary link disabled" style="padding: 0">{{ __("item.buyed") }}</span>
							{% endif %}
						</td>
					</tr>
				{% endfor %}
				</tbody>
			</table>

			{% include '../fragments/pagination.swig' %}

			{% if error %}
				<div id="money-error" class="alert alert-danger" th:text="#{error.highlighter}">{{ __("error.highlighter") }}</div>
			{% endif %}

			<script th:inline="javascript">
                /*<![CDATA[*/
                $('.hightlighter').click(function () {
                    let id = $(this).attr('id');
                    $("#modalHighlighter").attr("action", id);
                });

                let rows = $("#tableItems tr").length - 1;
                let value = (4 * 56) - (rows * 56);
                document.getElementById('tableItems').style.marginBottom = value + ".px";
                /*]]>*/
			</script>

			<!-- Modal -->
			<div class="modal fade" id="modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="exampleModalLabel">{{ __("modal.highlighter.title") }}</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body">
							<span>{{ __("modal.highlighter.body") }}</span>
						</div>
						<div class="modal-footer">
							<form id="modalHighlighter" class="form-horizontal" method="post" action="/">
								<button id="confirmButton" type="submit" class="btn btn-primary link">{{ __("modal.highlighter.button") }}</button>
							</form>
						</div>
					</div>
				</div>
			</div>

		</div>
	</div>
{% endblock %}
