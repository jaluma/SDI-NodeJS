<div>
	<div class="bmd-form-group bmd-collapse-inline pull-xs-right">
		<label for="searchText"></label>
		<input class="form-control" type="text" id="searchText" placeholder="{{ __("placeholder.search") }}"
		       value="{{ searchText }}"/>
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
            let searchParams = new URLSearchParams(window.location.search);
            let value = $("#searchText").val();
            searchParams.set("searchText", value);
            searchParams.set("page", "0");
            window.location.search = searchParams.toString();
            $().load(url);
        });
        $('#clearButton').click(function () {
            let searchParams = new URLSearchParams(window.location.search);
            searchParams.delete("searchText");
            searchParams.delete("page");
            window.location.search = searchParams.toString();
        })
        /*]]>*/
	</script>
</div>
