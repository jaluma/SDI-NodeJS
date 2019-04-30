<nav class="navbar navbar-expand-lg navbar-dark indigo">
	<!-- Navbar brand -->
	{% if currentUser === null %}
		<a class="navbar-brand" href="/">
			<img src="/img/logo.png" width="30" height="30" class="d-inline-block align-center" alt="logo">
			<span>{{ __("nav.title") }}</span>
		</a>
	{% else %}
		<a class="navbar-brand" href="/home">
			<img src="/img/logo.png" width="30" height="30" class="d-inline-block align-center" alt="logo">
			<span>{{ __("nav.title") }}</span>
		</a>
	{% endif %}

	<!-- Collapse button -->
	<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#basicExampleNav"
	        aria-controls="basicExampleNav" aria-expanded="false" aria-label="Toggle navigation">
		<span class="navbar-toggler-icon"></span>
	</button>

	<!-- Collapsible content -->
	<div class="collapse navbar-collapse" id="basicExampleNav">
		<!-- Links -->
		<ul class="navbar-nav mr-auto">
			{% if currentUser !== null and currentUser.role === "ADMIN_ROLE" %}
				<li class="nav-item">
					<a class="nav-link" id="adminListMenu" href="/admin/list">{{ __("nav.users") }}</a>
				</li>
				<li class="nav-item">
					<a class="nav-link" id="adminLog" href="/admin/logging">{{ __("nav.admin.log") }}</a>
				</li>
			{% endif %}

			{% if currentUser !== null and currentUser.role === "STANDARD_ROLE" %}
				<li class="nav-item dropdown">
					<a class="nav-link dropdown-toggle" id="mySellsDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true"
					   aria-expanded="false">
						<span>{{ __("nav.sales.mySales") }}</span>
					</a>
					<div class="dropdown-menu dropdown-menu-right dropdown-info" id="mySellsDropdownMenuButton"
					     aria-labelledby="mySellsDropdownMenuLink">
						<a id="add" class="dropdown-item" href="/item/add">{{ __("nav.sales.add") }}</a>
						<a id="myList" class="dropdown-item" href="/item/mylist">{{ __("nav.sales.myList") }}</a>
					</div>
				</li>
				<li class="nav-item dropdown">
					<a class="nav-link dropdown-toggle" id="sellsDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						<span>{{ __("nav.sells.other") }}</span>
					</a>
					<div class="dropdown-menu dropdown-menu-left dropdown-info" id="sellsDropdownMenuButton" aria-labelledby="sellsDropdownMenuLink">
						<a id="buy" class="dropdown-item" href="/user/purchases">{{ __("nav.sells.bought") }}</a>
						<a id="list" class="dropdown-item" href="/item/list">{{ __("nav.sells.list") }}</a>
					</div>
				</li>
				<li class="nav-item">
					<a id="chat" class="nav-link" href="/chat/list"
					>{{ __("nav.chats") }}</a>
				</li>
			{% endif %}
		</ul>

		<ul class="navbar-nav ml-auto nav-flex-icons navbar-right">
			<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle" id="languajeDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<i class="material-icons">language</i>
				</a>
				<div class="dropdown-menu dropdown-menu-right dropdown-info" id="languageDropdownMenuButton"
				     aria-labelledby="languajeDropdownMenuLink">
					<a id="btnEnglish" class="dropdown-item" href="?lang=en">
						<img src="/img/if_uk_flag.png" style="border: 0; float: left; margin-right: 15px" alt="EN"/>
						<span>{{ __("language.en") }}</span>
					</a>
					<a id="btnSpanish" class="dropdown-item" href="?lang=es">
						<img src="/img/if_spain_flag.png" style="border: 0; float: left; margin-right: 15px" alt="ES"/>
						<span>{{ __("language.es") }}</span>
					</a>
				</div>
			</li>
			<li id="accountDropdown" class="nav-item dropdown">
				<a class="nav-link dropdown-toggle" id="navbarDropdownMenuLink-333" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<i class="fas fa-user"></i>
					<i class="material-icons">person</i>
				</a>
				<div id="dropdownMenuAccount" class="dropdown-menu dropdown-menu-right dropdown-info" aria-labelledby="navbarDropdownMenuLink-333">
					{% if currentUser === null %}
						<a class="dropdown-item signup" href="/signup">{{ __("nav.signup") }}</a>
						<a class="dropdown-item login" href="/login">{{ __("nav.login") }}</a>
					{% else %}
						<a class="dropdown-item login" href="/user/details/{{ currentUser.id }}">
							<aside class="profile-card" style="width: 100%">
								<header>
									<h6 id="email" style="font-weight: bold; text-align: center">{{ currentUser.fullName }}</h6>
									<h6 style="text-align: center">{{ currentUser.email }}</h6>
									<h6 id="money" style="font-weight: bold; font-size: 24px; text-align: center;">{{ currentUser.money }} €</h6>
								</header>
							</aside>
						</a>
						<a class="dropdown-item logout" href="/logout">{{ __("user.signout") }}</a>
					{% endif %}
				</div>
			</li>
		</ul>
	</div>
</nav>
