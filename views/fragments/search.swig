<div>
	<!--/*@thymesVar id="searchText" type="java.util.String"*/-->
	<div class="bmd-form-group bmd-collapse-inline pull-xs-right">
		<label for="searchText"></label>
		<input class="form-control" type="text" id="searchText" th:placeholder="#{placeholder.search}"
		       th:value="${searchText}"/>
		<button class="btn bmd-btn-icon" id="searchButton">
			<i class="material-icons">search</i>
		</button>
		<button class="btn bmd-btn-icon" id="clearButton">
			<i class="material-icons">clear</i>
		</button>
	</div>

	<script th:inline="javascript">
        /*<![CDATA[*/
        $("#searchButton").click(function () {
            var searchParams = new URLSearchParams(window.location.search);
            var value = $("#searchText").val();
            searchParams.set("searchText", value);
            searchParams.set("page", "0");
            window.location.search = searchParams.toString();
            $().load(url);
        });
        $('#clearButton').click(function () {
            var searchParams = new URLSearchParams(window.location.search);
            searchParams.delete("searchText");
            searchParams.delete("page");
            window.location.search = searchParams.toString();
        })
        /*]]>*/
	</script>
</div>
