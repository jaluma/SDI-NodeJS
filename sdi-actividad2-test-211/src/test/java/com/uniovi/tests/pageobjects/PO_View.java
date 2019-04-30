package com.uniovi.tests.pageobjects;

import com.uniovi.tests.util.SeleniumUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;
import java.util.concurrent.TimeUnit;

public class PO_View {

	static PO_Properties p = new PO_Properties("messages");
	private static int timeout = 10;

	static int getTimeout() {
		return timeout;
	}

	public static void setTimeout(int timeout) {
		PO_View.timeout = timeout;
	}

	public static void timeout(WebDriver driver) {
		driver.manage().timeouts().implicitlyWait(getTimeout(), TimeUnit.SECONDS);
	}

	/**
	 * Espera por la visibilidad de un texto correspondiente a la propiedad key en el idioma locale en la vista actualmente cargandose en driver..
	 *
	 * @param driver: apuntando al navegador abierto actualmente.
	 * @param key:    clave del archivo de propiedades.
	 * @return Se retornará la lista de elementos resultantes de la búsqueda.
	 */
	static public List<WebElement> checkKey(WebDriver driver, String key) {
		return SeleniumUtils.EsperaCargaPagina(driver, "text", key, getTimeout());
	}

	/**
	 * Espera por la visibilidad de un elemento/s en la vista actualmente cargandose en driver..
	 *
	 * @param driver: apuntando al navegador abierto actualmente.
	 * @param type:
	 * @param text:
	 * @return Se retornará la lista de elementos resultantes de la búsqueda.
	 */
	static public List<WebElement> checkElement(WebDriver driver, String type, String text) {
		return SeleniumUtils.EsperaCargaPagina(driver, type, text, getTimeout());
	}

	static public int checkNumberList(WebDriver driver) {
		new WebDriverWait(driver, timeout);
		return checkNumberListWithputTimeout(driver);
	}

	static public int checkNumberListWithputTimeout(WebDriver driver) {
		return driver.findElements(By.xpath("//table/tbody/tr")).size();
	}

	static public void changePage(WebDriver driver, int page) {
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "class", "page-link", getTimeout());
		elementos.get(page).click();
	}
}
