{% extends '../layout.swig' %}

{% block title %} {{ __("admin.list.header") }} {% endblock %}

{% block body %}
	<div class="container">
		<h2>{{ __("user.list.header") }}</h2>

		<div th:replace="fragments/search"></div>
		<form name="list" class="form-horizontal" method="post" action="/admin/remove">
			<div class="table-responsive">

				<table id="tableUsers" class="table table-hover">
					<thead>
					<tr>
						<th class="check-box-table-cell"></th>
						<th>{{ __("user.email") }}</th>
						<th>{{ __("user.name") }}</th>
						<th>{{ __("user.lastName") }}</th>
						<th></th>
					</tr>
					</thead>
					<tbody>
					{% for user in usersList %}
						<tr class="tr-static-height">
							<td class="check-box-column">
								<label>
									<input type="checkbox" name="checkbox" value="{{ user._id }}"/>
								</label>
							</td>
							<td class="clickable-row" data-href="{{ '/user/details/' +  user._id }}">{{ user.email }}</td>
							<td class="clickable-row" data-href="{{ '/user/details/' +  user._id }}">{{ user.name }}</td>
							<td class="clickable-row" data-href="{{ '/user/details/' +  user._id }}">{{ user.lastName }}</td>
						</tr>
					{% endfor %}
					</tbody>
				</table>

				{% include '../fragments/pagination.swig' %}

				<script th:inline="javascript">
                    /*<![CDATA[*/
                    let rows = $('#tableUsers tr').length - 1;
                    let value = 460 - (rows * 46) + 15;
                    document.getElementById('tableUsers').style.marginBottom = value + ".px";
                    /*]]>*/
				</script>
				<button type="submit" id="delete" class="btn btn-primary bmd-btn-fab fab indigo"><i class="material-icons">delete</i></button>
			</div>
		</form>
	</div>
{% endblock %}
