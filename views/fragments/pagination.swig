{% if actual and totalPages %}
	<nav aria-label="pagination">
		<ul class="pagination justify-content-center">
			<li class="page-item">
				<a class="page-link indigo" href="javascript:clickPageButton(1)">
					<span aria-hidden="true">&#171;</span>
				</a>
			</li>
			{% if actual > 1 %}
				<li class="page-item" id="pi-{{ actual - 1 }}">
					<a class="page-link indigo" href="javascript:clickPageButton({{ actual - 1 }})">{{ actual - 1 }}</a>
				</li>
			{% endif %}

			<li class="page-item" id="pi-{{ actual }}">
				<a class="page-link indigo_dark" href="javascript:clickPageButton({{ actual }})">{{ actual }}</a>
			</li>

			{% if actual + 1 < totalPages %}
				<li class="page-item" id="pi-{{ actual + 1 }}">
					<a class="page-link indigo" href="javascript:clickPageButton({{ actual + 1 }})">{{ actual + 1 }}</a>
				</li>
			{% endif %}
			<li class="page-item">
				<a class="page-link indigo" href="javascript:clickPageButton({{ totalPages }})">
					<span aria-hidden="true">&#187;</span>
				</a>
			</li>
		</ul>
		<script th:inline="javascript">
            /*<![CDATA[*/
            const url = require("url");

            function clickPageButton(page) {
                let searchParams = new URLSearchParams(window.location.search);
                if (searchParams.get("searchText")) {
                    searchParams.set("searchText", $("#searchText").val());
                }
                searchParams.set("page", page);
                window.location.search = searchParams.toString();
                // temporal, sustituir por refresh en cliente
                $().load(url);
            }

            // enable diferent class actual page
            let actual = {{ actual }};
            $("#pi-{{ actual }}").addClass("indigo-dark");
            /*]]>*/
		</script>
	</nav>
{% endif %}
