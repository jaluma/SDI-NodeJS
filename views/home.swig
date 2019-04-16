{% extends 'layout.swig' %}

{% block title %} {{ __("nav.home") }} {% endblock %}

{% block body %}
	<div class="container">
		<div class="row text-center">
			<div id="personal-area" class="col-sm-5 mb-3">
				<div class="card" style="height: 100%">
					<div class="card-body text-center">
						<img class="card-img-top rounded-circle z-depth-0" style="max-width: 200px"
						     src="http://icons.iconarchive.com/icons/papirus-team/papirus-status/256/avatar-default-icon.png"
						     alt="Card image cap">
						<h2 class="card-title card-title-pro">{{ __("welcome.message") }}</h2>
						<h3>{{ currentUser.fullName }}</h3>
						<a href="{{ '/user/details/' + currentUser._id }}" class="btn btn-primary link">{{ __("home.user.personal") }}</a>
					</div>
				</div>
			</div>

			{% if currentUser.role === "STANDARD_ROLE" %}
				<div id="highlighter_table" class="col-sm-7 mb-3" sec:authorize="hasRole('ROLE_STANDARD')">
					<div class="card" style="width: 100%; height: 100%;min-height: 350px">
						<h2 class="card-title card-title-pro">{{ __("home.highlighter") }}</h2>
						{% if hightlighter_items!== null and hightlighter_items.length > 0 %}
							<table id="tableItems" class="table table-hover">
								<thead>
								<tr>
									<th>{{ __("item.title") }}</th>
									<th>{{ __("item.description") }}</th>
									<th>{{ __("item.price") }}</th>
								</tr>
								</thead>
								<tbody>
								<tr class="tr-static-height">
									{% for item in hightlighter_items %}
										<td class="clickable-row" data-href="/item/details/' + {{ item._id }}">{{ item.title }}</td>
										<td class="clickable-row" data-href="/item/details/' + {{ item._id }}">{{ item.description }}</td>
										<td class="clickable-row" data-href="/item/details/' + {{ item._id }}">{{ item.price }}</td>
									{% endfor %}
								</tr>
								</tbody>
							</table>
						{% endif %}
					</div>
				</div>
			{% endif %}
		</div>

		<div class="mb-3 text-center">
			{% if currentUser.role === "STANDARD_ROLE" %}
				<div class="col-sm-12">
					<div class="card" style="height: 100%; min-height: 350px">
						<h2 class="card-title card-title-pro">{{ __("nav.sales.mySales") }}</h2>
						{% if itemsList !== null and itemsList.length > 0 %}
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
										<td><a id="delete" class="link" href="{{ '/item/delete/' + item._id }}"><i
														class="material-icons">delete</i></a>
										</td>
										<td>
											{% if item.highlighter !== true and item.buyerUser === null %}
												<a class="hightlighter link" id="{{ '/item/highlighter/' + item._id }}" data-toggle="modal"
												   data-target="#modal"
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
							<script th:inline="javascript">
                                /*<![CDATA[*/
                                $('.hightlighter').click(function () {
                                    let id = $(this).attr('id');
                                    $("#modalHighlighter").attr("action", id);
                                });

                                let rows = $("#tableItems tr").length - 1;
                                let value = (5 * 56) - (rows * 56);
                                document.getElementById('tableItems').style.marginBottom = value + ".px";
                                /*]]>*/
							</script>
						{% endif %}
					</div>
				</div>
			{% endif %}
		</div>
	</div>
{% endblock %}
