{% extends '../layout.swig' %}

{% block title %} {{ __("nav.chats") }} {% endblock %}

{% block body %}
	<div class="container">
		<h2>{{ __("nav.chats") }}</h2>

		<div class="table-responsive" th:fragment="tableChats">
			<table id="tableChats" class="table table-hover">
				<thead>
				<tr>
					<th>{{ __("item.title") }}</th>
					<th>{{ __("user.email") }}</th>
				</tr>
				</thead>
				<tbody>
				{% for chat in chatsList %}
					<tr id="chat" class="tr-static-height" style="cursor: pointer;">
						<td class="clickable-row" data-href="{{ '/chat/conversation/' + chat._id }}">
							{{ chat.item.title }}
						</td>
						<td class="clickable-row" data-href="{{ '/chat/conversation/' + chat._id }}">
							{{ chat.otherUser.email }}
						</td>
						<td>
							<a id="removeButton" class="link" href="{{ '/chat/delete/' + chat._id }}">
								<i class="material-icons">delete</i>
							</a>
						</td>
					</tr>
				{% endfor %}
				</tbody>
			</table>

			{% include '../fragments/pagination.swig' %}

			<script th:inline="javascript">
                /*<![CDATA[*/
                let rows = $('#tableChats tr').length - 1;
                let value = (10 * 56) - (rows * 56) + 15;
                document.getElementById('tableChats').style.marginBottom = value + ".px";
                /*]]>*/
			</script>
		</div>
	</div>
{% endblock %}
