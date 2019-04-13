<nav class="navbar navbar-expand-lg navbar-dark indigo">
	<!-- Navbar brand -->
	<a class="navbar-brand" href="/">
		<img src="/img/logo.png" width="30" height="30" class="d-inline-block align-center" alt="logo">
		<span th:text="#{nav.title}"></span>
	</a>
	<a class="navbar-brand" href="/home">
		<img src="/img/logo.png" width="30" height="30" class="d-inline-block align-center" alt="logo">
		<span th:text="#{nav.title}"></span>
	</a>

	<!-- Collapse button -->
	<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#basicExampleNav"
	        aria-controls="basicExampleNav"
	        aria-expanded="false" aria-label="Toggle navigation">
		<span class="navbar-toggler-icon"></span>
	</button>

	<!-- Collapsible content -->
	<div class="collapse navbar-collapse" id="basicExampleNav">

		<!-- Links -->
		<ul class="navbar-nav mr-auto">
			<li class="nav-item">
				<a class="nav-link" id="adminListMenu" href="/admin/list" th:text="#{nav.users}"></a>
			</li>
			<li class="nav-item">
				<a class="nav-link" id="adminLog" href="/admin/logging" th:text="#{nav.admin.log}"></a>
			</li>
			<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle" id="mySellsDropdownMenuLink" data-toggle="dropdown"
				   aria-haspopup="true"
				   aria-expanded="false">
					<span th:text="#{nav.sales.mySales}"></span>
				</a>
				<div class="dropdown-menu dropdown-menu-right dropdown-info" id="mySellsDropdownMenuButton"
				     aria-labelledby="mySellsDropdownMenuLink">
					<a id="add" class="dropdown-item" href="/item/add" th:text="#{nav.sells.add}"></a>
					<a id="myList" class="dropdown-item" href="/item/mylist" th:text="#{nav.sells.myList}"></a>
				</div>
			</li>
			<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle" id="sellsDropdownMenuLink" data-toggle="dropdown"
				   aria-haspopup="true"
				   aria-expanded="false">
					<span th:text="#{nav.sales.other}"></span>
				</a>
				<div class="dropdown-menu dropdown-menu-left dropdown-info" id="sellsDropdownMenuButton"
				     aria-labelledby="sellsDropdownMenuLink">
					<a id="buy" class="dropdown-item" href="/user/purchases" th:text="#{nav.sells.bought}"></a>
					<a id="list" class="dropdown-item" href="/item/list" th:text="#{nav.sells.list}"></a>
				</div>
			</li>
			<li class="nav-item">
				<a id="chat" class="nav-link" href="/chat/list"
				   th:text="#{nav.chats}"></a>
			</li>
		</ul>

		<ul class="navbar-nav ml-auto nav-flex-icons navbar-right">
			<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle" id="languajeDropdownMenuLink" data-toggle="dropdown"
				   aria-haspopup="true"
				   aria-expanded="false">
					<i class="material-icons">language</i>
				</a>
				<div class="dropdown-menu dropdown-menu-right dropdown-info" id="languageDropdownMenuButton"
				     aria-labelledby="languajeDropdownMenuLink">
					<a id="btnEnglish" value="EN" class="dropdown-item">
						<img src="/img/if_uk_flag.png" style="border: 0; float: left; margin-right: 15px" alt="EN"/>
						<span th:text="#{language.en}"></span>
					</a>
					<a id="btnSpanish" value="ES" class="dropdown-item">
						<img th:src="/img/if_spain_flag.png" style="border: 0; float: left; margin-right: 15px"
						     alt="ES"/>
						<span th:text="#{language.es}"></span>
					</a>
				</div>
			</li>
			<li id="accountDropdown" class="nav-item dropdown">
				<a class="nav-link dropdown-toggle" id="navbarDropdownMenuLink-333" data-toggle="dropdown"
				   aria-haspopup="true"
				   aria-expanded="false">
					<i class="fas fa-user"></i>
					<i class="material-icons">person</i>
				</a>
				<div id="dropdownMenuAccount" class="dropdown-menu dropdown-menu-right dropdown-info"
				     aria-labelledby="navbarDropdownMenuLink-333">
					<a class="dropdown-item signup" href="/signup"
					   th:text="#{nav.signup}"></a>
					<a class="dropdown-item login" href="/login"
					   th:text="#{nav.login}"></a>
					<!--/*@thymesVar id="currentUser" type="com.uniovi.entities.User"*/-->
					<a class="dropdown-item login"
					   th:href="${'/user/details/' + currentUser.getId()}">
						<aside class="profile-card">
							<header>
								<h6 id="email" style="font-weight: bold; text-align: center"
								    th:text="#{nav.user.name(${currentUser.getFullName()})}"></h6>
								<h6 style="text-align: center"
								    th:text="#{nav.user.name(${currentUser.getEmail()})}"></h6>
								<h6 id="money" style="font-weight: bold; font-size: 24px; text-align: center;"
								    th:text="#{nav.user.money(${currentUser.getMoney()})}"></h6>
							</header>
						</aside>
					</a>
					<a class="dropdown-item logout" href="/logout"
					   th:text="#{user.signout}"></a>
				</div>
			</li>
		</ul>
	</div>
</nav>
