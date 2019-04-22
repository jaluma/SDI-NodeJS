package com.uniovi.tests.pageobjects;

import com.uniovi.tests.util.SeleniumUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

import static org.junit.Assert.assertEquals;

public class PO_ItemView extends PO_NavView {

	static public void addFillForm(WebDriver driver, String titlep, String descriptionp, String pricep, boolean highlighterp) {
		WebElement title = driver.findElement(By.name("title"));
		title.click();
		title.clear();
		title.sendKeys(titlep);
		WebElement description = driver.findElement(By.name("description"));
		description.click();
		description.clear();
		description.sendKeys(descriptionp);
		WebElement dateFormat = driver.findElement(By.name("dateFormat"));
		WebElement price = driver.findElement(By.name("price"));
		price.click();
		price.clear();
		price.sendKeys(pricep);
		if(!highlighterp) {
			WebElement highlighter = driver.findElement(By.id("highlighter"));
			highlighter.click();
		}

		By boton = By.id("addButton");
		driver.findElement(boton).click();
	}

	static public void remove(WebDriver driver, int index) {
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "id", "delete", getTimeout());
		elementos.get(index).click();
	}

	static public void searchText(WebDriver driver, String searchText) {
		WebElement search = driver.findElement(By.id("searchText"));
		search.click();
		search.clear();
		search.sendKeys(searchText);
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "id", "searchButton", getTimeout());
		elementos.get(0).click();
	}

	private static String buy(WebDriver driver, int index) {
		By enlace = By.xpath("//table/tbody/tr[" + index + "]/td[3]");
		String money = driver.findElement(enlace).getText();
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "id", "buyButton", getTimeout());
		elementos.get(index - 1).click();
		return money;
	}

	public static void buyItem(WebDriver driver, int index, double money) {
		double moneyCost = Double.parseDouble(buy(driver, index).replace(",", "."));
		double moneyActual = Double.parseDouble(PO_NavView.money(driver).replace(",", "."));
		if(money - moneyCost >= 0) {
			assertEquals(money - moneyCost, moneyActual, 0.1);
		}
	}

	public static void moneyError(WebDriver driver) {
		List<WebElement> search = driver.findElements(By.id("money-error"));
		assertEquals(1, search.size());
	}

	public static void chatButton(WebDriver driver, int index) {
		List<WebElement> search = driver.findElements(By.id("chatButton"));
		search.get(index).click();
	}

	public static void clickHighlighter(WebDriver driver, int index) {
		List<WebElement> search = driver.findElements(By.className("hightlighter"));
		search.get(index).click();
		List<WebElement> confirm = driver.findElements(By.id("confirmButton"));
		confirm.get(0).click();
	}
}
