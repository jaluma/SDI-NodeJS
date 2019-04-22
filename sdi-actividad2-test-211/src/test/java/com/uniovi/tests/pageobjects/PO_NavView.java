package com.uniovi.tests.pageobjects;

import com.uniovi.tests.util.SeleniumUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

import static org.junit.Assert.assertEquals;

public class PO_NavView extends PO_View {

	/**
	 * CLicka una de las opciones principales (a href) y comprueba que se vaya a la vista
	 * con el elemento de tipo type con el texto Destino
	 *
	 * @param driver:     apuntando al navegador abierto actualmente.
	 * @param textOption: Texto de la opción principal.
	 */
	public static void clickOption(WebDriver driver, String textOption) {
		//CLickamos en la opción de registro y esperamos a que se cargue el enlace de Registro.
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "@href", textOption, getTimeout());
		//Tiene que haber un sólo elemento.
		assertEquals(1, elementos.size());
		//Ahora lo clickamos
		elementos.get(0).click();
	}

	/**
	 * Selecciona el enlace de idioma correspondiente al texto textLanguage
	 *
	 * @param driver:       apuntando al navegador abierto actualmente.
	 * @param textLanguage: el texto que aparece en el enlace de idioma ("English" o
	 *                      "Spanish")
	 */
	public static void changeIdiom(WebDriver driver, String textLanguage) {

		//clickamos la opción Idioma.
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "id", "languajeDropdownMenuLink", getTimeout());
		elementos.get(0).click();
		//SeleniumUtils.esperarSegundos(driver, 2);
		//CLickamos la opción Inglés partiendo de la opción Español
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "id", textLanguage, getTimeout());
		elementos.get(0).click();

	}

	public static void signup(WebDriver driver) {
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "id", "accountDropdown", getTimeout());
		elementos.get(0).click();
		SeleniumUtils.EsperaCargaPagina(driver, "id", "dropdownMenuAccount", getTimeout());

		elementos = SeleniumUtils.EsperaCargaPagina(driver, "class", "signup", getTimeout());
		elementos.get(0).click();
	}

	public static void login(WebDriver driver) {
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "id", "accountDropdown", getTimeout());
		elementos.get(0).click();
		SeleniumUtils.EsperaCargaPagina(driver, "id", "dropdownMenuAccount", getTimeout());

		elementos = SeleniumUtils.EsperaCargaPagina(driver, "class", "login", getTimeout());
		elementos.get(0).click();
	}

	public static void logout(WebDriver driver) {
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "id", "accountDropdown", getTimeout());
		elementos.get(0).click();
		SeleniumUtils.EsperaCargaPagina(driver, "id", "dropdownMenuAccount", getTimeout());

		elementos = SeleniumUtils.EsperaCargaPagina(driver, "class", "logout", getTimeout());
		elementos.get(0).click();
	}

	public static boolean checkButtonLogout(WebDriver driver) {
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "id", "accountDropdown", getTimeout());
		elementos.get(0).click();

		return SeleniumUtils.EsperaCargaPagina(driver, "id", "dropdownMenuAccount", getTimeout()).size() == 2;  //solo login y registrarse
	}

	public static void navbar(WebDriver driver, String idNavBar, String idMenuItem) {
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "id", idNavBar, getTimeout());
		elementos.get(0).click();

		elementos = SeleniumUtils.EsperaCargaPagina(driver, "id", idMenuItem, getTimeout());
		elementos.get(0).click();
	}

	public static String money(WebDriver driver) {
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "id", "accountDropdown", getTimeout());
		elementos.get(0).click();
		SeleniumUtils.EsperaCargaPagina(driver, "id", "dropdownMenuAccount", getTimeout());

		WebElement money = driver.findElement(By.id("money"));
		return money.getText().replace(" €", "").replace(",", ".");
	}
}