package com.uniovi.tests.pageobjects;

import com.uniovi.tests.util.SeleniumUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

import static org.junit.Assert.assertEquals;

public class PO_LoginView extends PO_NavView {
	static public void fillForm(WebDriver driver, String dnip, String passwordp) {
		WebElement dni = driver.findElement(By.name("email"));
		dni.click();
		dni.clear();
		dni.sendKeys(dnip);
		WebElement password = driver.findElement(By.name("password"));
		password.click();
		password.clear();
		password.sendKeys(passwordp);
		//Pulsar el boton de Alta.
		By boton = By.className("btn");
		driver.findElement(boton).click();
	}

	static public void checkLoginPage(WebDriver driver) {
		List<WebElement> elements = SeleniumUtils.EsperaCargaPagina(driver, "id", "login-button", getTimeout());
		assertEquals(1, elements.size());
	}
}