package com.uniovi.tests.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class PO_ChatView extends PO_View {

	public static void sendMessage(WebDriver driver, String message) throws InterruptedException {
		Thread.sleep(500);
		WebElement element = driver.findElement(By.id("messageInput"));
		element.click();
		element.clear();
		element.sendKeys(message);
		Thread.sleep(500);
		WebElement chatButton = driver.findElement(By.id("sendButton"));
		chatButton.click();
		Thread.sleep(2000);
	}

	public static int getNumberMessages(WebDriver driver) {
		List<WebElement> list = driver.findElements(By.id("message"));
		return list.size();
	}

	public static void selectChatList(WebDriver driver, int index) {
		List<WebElement> list = driver.findElements(By.xpath("//table/tbody/tr[" + (index + 1) + "]/td[1]"));
		list.get(0).click();
	}

	public static void deleteCharList(WebDriver driver, int index) {
		List<WebElement> list = driver.findElements(By.id("removeButton"));
		list.get(index).click();
	}

	static public int checkNumberList(WebDriver driver) {
		List<WebElement> list = driver.findElements(By.xpath("//table/tbody/tr"));
		return list.size();
	}
}
