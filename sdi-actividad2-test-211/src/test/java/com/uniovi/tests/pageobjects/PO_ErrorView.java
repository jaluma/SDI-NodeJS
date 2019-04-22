package com.uniovi.tests.pageobjects;

import org.openqa.selenium.WebDriver;

public class PO_ErrorView extends PO_NavView {
	public static void checkError(WebDriver driver, String errorMessage) {
		com.uniovi.tests.util.SeleniumUtils.EsperaCargaPagina(driver, "text", errorMessage, getTimeout());
	}
}
