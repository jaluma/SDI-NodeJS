{% extends '../layout.swig' %}

{% block title %} {{ __("chat.header") }} {% endblock %}
{% block scripts %}
	<link rel="stylesheet" href="/css/chat.css">
	<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.4/socket.io.js"></script>
	<script src="/js/chat_conversation.js"></script>
	<script src="https://momentjs.com/downloads/moment-with-locales.js"></script>
{% endblock %}

{% block body %}
	<div class="container">
		<h2>{{ __("chat.header", chat.item.sellerUser.fullName) }}</h2>
		<div id="chat" class="card">
			<ul id="messages">
				{% for message in chat.messages %}
					<li id="message" style="list-style: none;">
						<div class="message-data{% if message.user._id === currentUser._id %} my-message-data {% else %} other-message-data {% endif %}">
							<span id="username_data" class="message-data-name">{{ message.user.fullName }}</span>
							<span id="time_data" class="message-data-time">{{ moment(message.time).format('lll') }}</span>
						</div>

						<div class="text_wrapper message{% if message.user._id === currentUser._id %} my-message {% else %} other-message {% endif %}">
							<span id="message_text" class="text">{{ message.message }}</span>
						</div>
					</li>
				{% endfor %}
			</ul>
			<div class="input-group align-middle">
				<label for="messageInput"></label>
				<input class="ml-1" name="message" autocomplete="off" id="messageInput" placeholder="{{ __("placeholder.chat") }}"/>
				<div class="input-group-append">
					<button type="button" class="btn" id="sendButton">
						<i class="material-icons">send</i>
					</button>
				</div>
			</div>
		</div>
	</div>

	<span id="currentUser" style="display: none">{{ currentUser.email }}</span>
	<span id="chatId" style="display: none">{{ chat._id }}</span>

	<div id="copy" style="display: none;">
		<ul>
			<li id="message" style="list-style: none;">
				<div class="message-data">
					<span id="username_data" class="message-data-name"></span>
					<span id="time_data" class="message-data-time"></span>
				</div>

				<div class="text_wrapper message">
					<span id="message_text" class="text"></span>
				</div>
			</li>
		</ul>
	</div>

{% endblock %}
