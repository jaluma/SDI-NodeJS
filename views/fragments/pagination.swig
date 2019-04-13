<nav aria-label="pagination">
	<!--/*@thymesVar id="page" type="org.springframework.data.domain.Page<com.uniovi.entities.Mark>"*/-->
	<ul class="pagination justify-content-center" th:if="${page != null && page.getTotalPages() > 1}">
		<li class="page-item">
			<a class="page-link indigo" href="javascript:clickPageButton(0)"><span aria-hidden="true">&#171;</span></a>
		</li>
		<!-- Anterior (si la hay ) -->
		<li class="page-item" th:if="${page.getNumber()-1 >= 0}">
			<a class="page-link indigo" th:href="@{'javascript:clickPageButton(' + ${page.getNumber()-1} +')'}"
			   th:text="${page.getNumber()}"></a>
		</li>
		<li class="page-item">
			<span class="page-link indigo_dark" th:text="${page.getNumber()+1}"></span>
		</li>
		<li class="page-item" th:if="${page.getNumber()+1 <= page.getTotalPages()-1}">
			<a class="page-link indigo" th:href="@{'javascript:clickPageButton(' + ${page.getNumber()+1} + ')'}"
			   th:text="${page.getNumber()+2}"></a>
		</li>
		<!-- Última -->
		<li class="page-item">
			<a class="page-link indigo"
			   th:href="@{'javascript:clickPageButton(' + ${page.getTotalPages()-1} + ')'}"><span
						aria-hidden="true">&#187;</span></a>
		</li>
	</ul>
	<script th:inline="javascript">
        /*<![CDATA[*/
        function clickPageButton(page) {
            var searchParams = new URLSearchParams(window.location.search);
            if (searchParams.get("searchText")) {
                searchParams.set("searchText", $("#searchText").val());
            }
            searchParams.set("page", page);
            window.location.search = searchParams.toString();
            $().load(url);
        }

        /*]]>*/
	</script>
</nav>
