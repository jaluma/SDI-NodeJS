package com.uniovi.tests.pageobjects;

import com.uniovi.tests.util.SeleniumUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class PO_AdminListView extends PO_NavView {

	static public void goAdminList(WebDriver driver) {
		String email = "admin@email.com";
		String password = "admin";
		PO_NavView.login(driver);
		PO_LoginView.fillForm(driver, email, password);
		PO_NavView.clickOption(driver, "/admin/list");
		PO_AdminListView.checkList(driver);
	}

	static private void checkList(WebDriver driver) {
		checkElement(driver, "id", "tableUsers");
	}

	static public void deleteElements(WebDriver driver, int index) {
		selectUsers(driver, index);
		delete(driver, "id");
	}

	private static void selectUsers(WebDriver driver, int index) {
		By enlace = By.xpath("//tr[" + index + "]/td[1]/label/input");
		driver.findElement(enlace).click();
	}

	private static void delete(WebDriver driver, String id) {
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, id, "delete", getTimeout());
		elementos.get(0).click();
	}
}
