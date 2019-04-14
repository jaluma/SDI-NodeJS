<nav aria-label="pagination">
	<ul class="pagination justify-content-center" th:if="${page != null && page.getTotalPages() > 1}">
		<li class="page-item">
			<a class="page-link indigo" href="javascript:clickPageButton(0)">
				<span aria-hidden="true">&#171;</span>
			</a>
		</li>
		{% for page in pages %}
			<li class="page-item" id="pi-{{ page }}">
				<a class="page-link" href="javascript:clickPageButton({{ page }})">{{ page }}</a>
			</li>
		{% endfor %}
		<li class="page-item">
			<a class="page-link indigo" href="javascript:clickPageButton( {{ actual }} + 2)">
				<span aria-hidden="true">&#187;</span>
			</a>
		</li>
	</ul>
	<script th:inline="javascript">
        /*<![CDATA[*/
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
