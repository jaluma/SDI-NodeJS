package com.uniovi.tests.pageobjects;

import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.ResourceBundle;

public class PO_Properties {
	private static Locale[] idioms = new Locale[]{new Locale("ES"), new Locale("EN")};
	static private String Path;

	PO_Properties(String Path) //throws FileNotFoundException, IOException
	{
		PO_Properties.Path = Path;
	}

	public static int getSPANISH() {
		return 0;
	}

	public static int getENGLISH() {
		return 1;
	}

	String getString(String prop, int locale) {
		ResourceBundle bundle = ResourceBundle.getBundle(Path, idioms[locale]);
		String value = bundle.getString(prop);
		return new String(value.getBytes(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8);
	}
}
