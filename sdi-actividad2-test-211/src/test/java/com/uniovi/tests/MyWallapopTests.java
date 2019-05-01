package com.uniovi.tests;

import com.uniovi.services.*;
import com.uniovi.tests.pageobjects.*;
import org.junit.*;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import static org.junit.Assert.*;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class MyWallapopTests {

	static String URLlocal = "http://localhost:8081";
	private static final String URL = URLlocal;
	static String URLremota = "http://ec2-35-180-117-233.eu-west-3.compute.amazonaws.com:8081";         // cambiar luego
	//En Windows (Debe ser la versión 65.0.1 y desactivar las actualizacioens automáticas)):
	private static String PathFirefox65 = "C:\\Program Files\\Mozilla Firefox\\firefox.exe";
	private static String Geckdriver024 = "C:\\Path\\geckodriver024win64.exe";
	//En MACOSX (Debe ser la versión 65.0.1 y desactivar las actualizacioens automáticas):
	//static String PathFirefox65 = "/Applications/Firefox.app/Contents/MacOS/firefox-bin";
	//static String Geckdriver024 = "/User/delacal/selenium/geckodriver024mac";
	//Común a Windows y a MACOSX
	private static WebDriver driver = getDriver(PathFirefox65, Geckdriver024);
	@Autowired
	private ChatsService chatsService;
	@Autowired
	private UsersService usersService;
	@Autowired
	private ItemsService itemsService;
	@Autowired
	private MessagesService messagesService;
	@Autowired
	private InsertSampleDataService insertSampleDataService;

	private static WebDriver getDriver(String PathFirefox, String Geckdriver) {
		System.setProperty("webdriver.firefox.bin", PathFirefox);
		System.setProperty("webdriver.gecko.driver", Geckdriver);
		return new FirefoxDriver();
	}

	@BeforeClass
	static public void begin() {
	}

	@AfterClass
	static public void end() {
		driver.quit();
	}

	@Before
	public void setUp() {
		driver.navigate().to(URL);
	}

	void initdb() {
		chatsService.deleteAll();
		itemsService.deleteAll();
		usersService.deleteAll();
		messagesService.deleteAll();
		insertSampleDataService.init();
	}

	@After
	public void tearDown() {
		driver.manage().deleteAllCookies();
	}

	//PR00. Inicializar los datos de la base de datos
	@Test
	public void PR00() {
		initdb();
	}

	//PR01. Registro de Usuario con datos válidos
	@Test
	public void PR01() {
		PO_NavView.signup(driver);
		PO_RegisterView.fillForm(driver, PO_RegisterView.generateRandomEmail(), "Josefo", "Perez", "777777", "777777");
		PO_HomeView.checkWelcome(driver, PO_Properties.getSPANISH());
	}

	//PR02. Registro de Usuario con datos inválidos (repetición de contraseña inválida).
	@Test
	public void PR02() {
		PO_NavView.signup(driver);
		PO_RegisterView.fillForm(driver, PO_RegisterView.generateRandomEmail(), "Josefo", "Perez", "777777", "666666");
		PO_RegisterView.checkElement(driver, "id", "signup-error");
	}

	//PR03.  Registro de Usuario con datos inválidos (email existente).
	@Test
	public void PR03() {
		String email = PO_RegisterView.generateRandomEmail();
		PO_NavView.signup(driver);
		PO_RegisterView.fillForm(driver, email, "Josefo", "Perez", "777777", "777777");
		PO_HomeView.checkWelcome(driver, PO_Properties.getSPANISH());
		PO_NavView.logout(driver);
		PO_NavView.signup(driver);
		PO_RegisterView.fillForm(driver, email, "Josefo", "Perez", "777777", "777777");
		PO_RegisterView.checkElement(driver, "id", "signup-error");
	}

	//PR04.  Inicio de sesión con datos válidos (usuario estándar).
	@Test
	public void PR04() {
		goHome("javier@email.com");
	}

	//PR05.  Inicio de sesión con datos INválidos (usuario estándar, email existente, pero contraseña incorrecta).
	@Test
	public void PR05() {
		String email = "javier@email.com";
		String password = "654321";
		PO_NavView.login(driver);
		PO_LoginView.fillForm(driver, email, password);
		PO_RegisterView.checkElement(driver, "id", "login-error");
	}

	//PR07.  Inicio de sesión con datos inválidos (usuario estándar, email no existente en la aplicación).
	@Test
	public void PR07() {
		String email = PO_RegisterView.generateRandomEmail();
		String password = "654321";
		PO_NavView.login(driver);
		PO_LoginView.fillForm(driver, email, password);
		PO_RegisterView.checkElement(driver, "id", "login-error");
	}

	//PR08.  Hacer click en la opción de salir de sesión y comprobar que se redirige a la página de inicio
	//de sesión (Login).
	@Test
	public void PR08() {
		goHome("javier@email.com");
		PO_NavView.logout(driver);
		PO_RegisterView.checkElement(driver, "id", "login-button");
	}

	//PR09.   Comprobar que el botón cerrar sesión no está visible si el usuario no está autenticado
	@Test
	public void PR09() {
		assertFalse(PO_NavView.checkButtonLogout(driver));
	}

	//PR10. Mostrar el listado de usuarios y comprobar que se muestran todos los que existen en el
	//sistema.
	@Test
	public void PR10() {
		PO_AdminListView.goAdminList(driver);
		assertEquals(10, PO_AdminListView.checkNumberList(driver));
		PO_AdminListView.changePage(driver, 2);
		assertEquals(10, PO_AdminListView.checkNumberList(driver));
	}

	//PR11. Ir a la lista de usuarios, borrar el primer usuario de la lista, comprobar que la lista se actualiza
	//y dicho usuario desaparece.
	@Test
	public void PR11() {
		PO_AdminListView.goAdminList(driver);
		assertEquals(10, PO_AdminListView.checkNumberList(driver));
		PO_AdminListView.changePage(driver, 2);
		assertEquals(10, PO_AdminListView.checkNumberList(driver));
		PO_AdminListView.changePage(driver, 3);
		assertEquals(2, PO_AdminListView.checkNumberList(driver));
		PO_AdminListView.changePage(driver, 1);
		PO_AdminListView.deleteElements(driver, 6); //borramos el 6 para que no de errores los siguientes tests
		assertEquals(10, PO_AdminListView.checkNumberList(driver));
		PO_AdminListView.changePage(driver, 2);
		assertEquals(10, PO_AdminListView.checkNumberList(driver));
		PO_AdminListView.changePage(driver, 3);
		assertEquals(1, PO_AdminListView.checkNumberList(driver));
	}

	//PR12. Ir a la lista de usuarios, borrar el último usuario de la lista, comprobar que la lista se actualiza
	//y dicho usuario desaparece
	@Test
	public void PR12() {
		PO_AdminListView.goAdminList(driver);
		assertEquals(10, PO_AdminListView.checkNumberList(driver));
		PO_AdminListView.changePage(driver, 2);
		assertEquals(10, PO_AdminListView.checkNumberList(driver));
		PO_AdminListView.changePage(driver, 3);
		assertEquals(1, PO_AdminListView.checkNumberList(driver));
		PO_AdminListView.deleteElements(driver, 1);
		assertEquals(10, PO_AdminListView.checkNumberList(driver));
		PO_AdminListView.changePage(driver, 2);
		assertEquals(10, PO_AdminListView.checkNumberList(driver));
	}

	//PR13. Ir a la lista de usuarios, borrar 3 usuarios de la lista, comprobar que la lista se actualiza
	//y dicho usuario desaparece
	@Test
	public void PR13() {
		//registramos a 3 usuarios
		PO_NavView.signup(driver);
		PO_RegisterView.fillForm(driver, PO_RegisterView.generateRandomEmail(), "Josefo", "Perez", "777777", "777777");
		PO_HomeView.checkWelcome(driver, PO_Properties.getSPANISH());
		PO_NavView.logout(driver);
		PO_RegisterView.checkElement(driver, "id", "login-button");

		PO_NavView.signup(driver);
		PO_RegisterView.fillForm(driver, PO_RegisterView.generateRandomEmail(), "Josefa", "Perez", "777777", "777777");
		PO_HomeView.checkWelcome(driver, PO_Properties.getSPANISH());
		PO_NavView.logout(driver);
		PO_RegisterView.checkElement(driver, "id", "login-button");

		PO_NavView.signup(driver);
		PO_RegisterView.fillForm(driver, PO_RegisterView.generateRandomEmail(), "Pepa", "Perez", "777777", "777777");
		PO_HomeView.checkWelcome(driver, PO_Properties.getSPANISH());
		PO_NavView.logout(driver);
		PO_RegisterView.checkElement(driver, "id", "login-button");

		PO_AdminListView.goAdminList(driver);
		assertEquals(10, PO_AdminListView.checkNumberList(driver));
		PO_AdminListView.changePage(driver, 2);
		assertEquals(10, PO_AdminListView.checkNumberList(driver));
		PO_AdminListView.changePage(driver, 3);
		assertEquals(3, PO_AdminListView.checkNumberList(driver));
		//ultima pagina
		PO_AdminListView.deleteElements(driver, 1);
		//primera pagina
		PO_AdminListView.deleteElements(driver, 6);
		//primera pagina
		PO_AdminListView.deleteElements(driver, 6);

		assertEquals(10, PO_AdminListView.checkNumberList(driver));
		PO_AdminListView.changePage(driver, 2);
		assertEquals(10, PO_AdminListView.checkNumberList(driver));
	}

	//PR14. Ir al formulario de alta de oferta, rellenarla con datos válidos y pulsar el botón Submit.
	//Comprobar que la oferta sale en el listado de ofertas de dicho usuario.
	@Test
	public void PR14() {
		goHome("javier@email.com");
		PO_NavView.navbar(driver, "mySellsDropdownMenuLink", "add");
		PO_ItemView.addFillForm(driver, "Prueba 1", "Descripcion 1", "10", false);
		PO_ItemView.checkElement(driver, "id", "tableItems");
	}

	//PR15. Ir al formulario de alta de oferta, rellenarla con datos inválidos (campo título vacío) y pulsar
	//el botón Submit. Comprobar que se muestra el mensaje de campo obligatorio.
	@Test
	public void PR15() {
		goHome("javier@email.com");
		PO_NavView.navbar(driver, "mySellsDropdownMenuLink", "add");
		PO_ItemView.addFillForm(driver, "", "Descripcion 1", "10", false);
		PO_ItemView.checkElement(driver, "class", "is-focused");
	}

	//PR16. Mostrar el listado de ofertas para dicho usuario y comprobar que se muestran todas los que
	//existen para este usuario.
	@Test
	public void PR16() {
		goHome("pedro@email.com");
		PO_NavView.navbar(driver, "mySellsDropdownMenuLink", "myList");
		assertEquals(4, PO_ItemView.checkNumberList(driver));
	}

	//PR17. Ir a la lista de ofertas, borrar la primera oferta de la lista, comprobar que la lista se actualiza y
	//que la oferta desaparece.
	@Test
	public void PR17() {
		goHome("pedro@email.com");
		PO_NavView.navbar(driver, "mySellsDropdownMenuLink", "myList");
		assertEquals(4, PO_ItemView.checkNumberList(driver));
		PO_ItemView.remove(driver, 0);      // la que hemos añadido antes
		assertEquals(3, PO_ItemView.checkNumberList(driver));
	}

	//PR18. Ir a la lista de ofertas, borrar la última oferta de la lista, comprobar que la lista se actualiza y
	//que la oferta desaparece.
	@Test
	public void PR18() {
		goHome("pedro@email.com");
		PO_NavView.navbar(driver, "mySellsDropdownMenuLink", "myList");
		assertEquals(3, PO_ItemView.checkNumberList(driver));
		PO_ItemView.remove(driver, 2);
		assertEquals(2, PO_ItemView.checkNumberList(driver));
	}

	//PR19. Hacer una búsqueda con el campo vacío y comprobar que se muestra la página que
	//corresponde con el listado de las ofertas existentes en el sistema
	@Test
	public void PR19() {
		goHome("javier@email.com");
		PO_NavView.navbar(driver, "sellsDropdownMenuLink", "list");
		assertEquals(5, PO_ItemView.checkNumberList(driver));
		PO_ItemView.searchText(driver, "");
		assertEquals(5, PO_ItemView.checkNumberList(driver));
	}

	//PR20. Hacer una búsqueda escribiendo en el campo un texto que no exista y comprobar que se
	//muestra la página que corresponde, con la lista de ofertas vacía
	@Test
	public void PR20() {
		goHome("javier@email.com");
		PO_NavView.navbar(driver, "sellsDropdownMenuLink", "list");
		assertEquals(5, PO_ItemView.checkNumberList(driver));
		PO_ItemView.searchText(driver, "aasdasdassdaa");
		assertEquals(0, PO_ItemView.checkNumberListWithputTimeout(driver));
	}

	//PR21. Hacer una búsqueda escribiendo en el campo un texto en minúscula o mayúscula y
	//comprobar que se muestra la página que corresponde, con la lista de ofertas que contengan dicho texto,
	//independientemente que el título esté almacenado en minúsculas o mayúscula.
	@Test
	public void PR21() {
		goHome("juan@email.com");
		PO_NavView.navbar(driver, "sellsDropdownMenuLink", "list");
		assertEquals(5, PO_ItemView.checkNumberList(driver));
		PO_ItemView.searchText(driver, "GORRA");
		assertEquals(1, PO_ItemView.checkNumberListWithputTimeout(driver));
	}

	//PR22. Sobre una búsqueda determinada (a elección de desarrollador), comprar una oferta que deja
	//un saldo positivo en el contador del comprobador. Y comprobar que el contador se actualiza
	//correctamente en la vista del comprador.
	@Test
	public void PR22() {
		goHome("juan@email.com");
		PO_NavView.navbar(driver, "sellsDropdownMenuLink", "list");
		assertEquals(5, PO_ItemView.checkNumberList(driver));
		String money = PO_NavView.money(driver);
		PO_ItemView.searchText(driver, "Prueba 1");
		assertEquals(1, PO_ItemView.checkNumberList(driver));
		PO_ItemView.buyItem(driver, 1, money);
	}

	//PR23. Sobre una búsqueda determinada (a elección de desarrollador), comprar una oferta que deja
	//un saldo 0 en el contador del comprobador. Y comprobar que el contador se actualiza correctamente en
	//la vista del comprador.
	@Test
	public void PR23() {
		goHome("juan@email.com");
		PO_NavView.navbar(driver, "sellsDropdownMenuLink", "list");
		assertEquals(5, PO_ItemView.checkNumberList(driver));
		String money = PO_NavView.money(driver);
		PO_ItemView.searchText(driver, "Cadena de musica");
		assertEquals(1, PO_ItemView.checkNumberList(driver));
		PO_ItemView.buyItem(driver, 1, money);
	}

	//PR24. Sobre una búsqueda determinada (a elección de desarrollador), intentar comprar una oferta
	//que esté por encima de saldo disponible del comprador. Y comprobar que se muestra el mensaje de
	//saldo no suficiente
	@Test
	public void PR24() {
		goHome("pedro@email.com");
		PO_NavView.navbar(driver, "sellsDropdownMenuLink", "list");
		assertEquals(5, PO_ItemView.checkNumberList(driver));
		String money = PO_NavView.money(driver);
		PO_ItemView.searchText(driver, "Silla");
		assertEquals(1, PO_ItemView.checkNumberList(driver));
		PO_ItemView.buyItem(driver, 1, money);
		PO_ItemView.moneyError(driver);
	}

	//PR25. Ir a la opción de ofertas compradas del usuario y mostrar la lista. Comprobar que aparecen
	//las ofertas que deben aparecer.
	@Test
	public void PR25() {
		goHome("javier@email.com");
		PO_NavView.navbar(driver, "sellsDropdownMenuLink", "buy");
		assertEquals(2, PO_ItemView.checkNumberList(driver));
	}

	//PR26. Al crear una oferta marcar dicha oferta como destacada y a continuación comprobar: i) que
	//aparece en el listado de ofertas destacadas para los usuarios y que el saldo del usuario se actualiza
	//adecuadamente en la vista del ofertante (-20).
	@Test
	public void PR26() {
		goHome("juan@email.com");
		String money = PO_NavView.money(driver);
		PO_NavView.navbar(driver, "mySellsDropdownMenuLink", "add");
		PO_ItemView.addFillForm(driver, "Prueba 2", "Descripcion 2", "10", true);
		String newMoney = PO_NavView.money(driver);
		assertEquals(Double.parseDouble(money) - 20, Double.parseDouble(newMoney), 0.1);
		driver.get(URL + "/home");
		PO_NavView.logout(driver);
		goHome("javier@email.com");
		PO_HomeView.checkElement(driver, "text", "Prueba 2");
	}

	//PR27. Sobre el listado de ofertas de un usuario con más de 20 euros de saldo, pinchar en el
	//enlace Destacada y a continuación comprobar: i) que aparece en el listado de ofertas destacadas para los
	//usuarios y que el saldo del usuario se actualiza adecuadamente en la vista del ofertante (-20).
	@Test
	public void PR27() {
		goHome("javier@email.com");
		String money = PO_NavView.money(driver);
		driver.get(URL + "/home");
		PO_NavView.navbar(driver, "mySellsDropdownMenuLink", "myList");
		PO_ItemView.clickHighlighter(driver, 0);
		assertEquals(Double.parseDouble(money) - 20, Double.parseDouble(PO_NavView.money(driver)), 0.1);
		driver.get(URL + "/home");
		PO_NavView.logout(driver);
		goHome("juan@email.com");
		PO_HomeView.checkElement(driver, "text", "Gorra");
	}

	//PR28. Sobre el listado de ofertas de un usuario con menos de 20 euros de saldo, pinchar en el
	//enlace Destacada y a continuación comprobar que se muestra el mensaje de saldo no suficiente.
	@Test
	public void PR28() {
		goHome("benjamin@email.com");
		driver.get(URL + "/home");
		PO_NavView.navbar(driver, "mySellsDropdownMenuLink", "myList");
		PO_ItemView.clickHighlighter(driver, 0);
		PO_ItemView.moneyError(driver);
	}

	//PR29.  Inicio de sesión con datos INválidos (usuario estándar, email existente, pero contraseña incorrecta).
	@Test
	public void PR29() {
		String email = "javier@email.com";
		String password = "654321";
		PO_NavView.login(driver);
		PO_LoginView.fillForm(driver, email, password);
		PO_RegisterView.checkElement(driver, "id", "login-error");
	}

	//PR30.  Inicio de sesión con datos inválidos (usuario estándar, email no existente en la aplicación).
	@Test
	public void PR30() {
		String email = PO_RegisterView.generateRandomEmail();
		String password = "";
		PO_NavView.login(driver);
		PO_LoginView.fillForm(driver, email, password);
		PO_ItemView.checkElement(driver, "class", "is-focused");
	}

	//PR31.  Inicio de sesión con datos inválidos (email existente, pero contraseña incorrecta).
	@Test
	public void PR31() {
		String email = "javier@email.com";
		String password = "";
		PO_NavView.login(driver);
		PO_LoginView.fillForm(driver, email, password);
		assertEquals(1, PO_RegisterView.checkElement(driver, "class", "is-focused").size());
	}

	//PR32. Mostrar el listado de ofertas disponibles y comprobar que se muestran todas las que existen,
	//menos las del usuario identificado.
	@Test
	public void PR32() {
		goHome("javier@email.com");
		PO_NavView.navbar(driver, "sellsDropdownMenuLink", "list");
		assertEquals(5, PO_ItemView.checkNumberList(driver));
		PO_ItemView.changePage(driver, 2);
		assertEquals(5, PO_ItemView.checkNumberList(driver));
		PO_ItemView.changePage(driver, 3);      // solo hay dos paginas
		assertEquals(0, PO_ChatView.getNumberMessages(driver));
	}

	//PR33. Sobre una búsqueda determinada de ofertas (a elección de desarrollador), enviar un mensaje
	//a una oferta concreta. Se abriría dicha conversación por primera vez. Comprobar que el mensaje aparece
	//en el listado de mensajes.
	@Test
	public void PR33() throws InterruptedException {
		goHome("juan@email.com");
		PO_NavView.navbar(driver, "sellsDropdownMenuLink", "list");
		assertEquals(5, PO_ItemView.checkNumberList(driver));
		PO_ItemView.searchText(driver, "Silla");
		assertEquals(1, PO_ItemView.checkNumberList(driver));
		PO_ItemView.chatButton(driver, 0);
		int oldNumber = PO_ChatView.getNumberMessages(driver);
		PO_ChatView.sendMessage(driver, "Hola buen amigo!");
		assertEquals(oldNumber + 1, PO_ChatView.getNumberMessages(driver));
	}

	//PR34. Sobre el listado de conversaciones enviar un mensaje a una conversación ya abierta.
	//Comprobar que el mensaje aparece en la lista de mensajes.
	@Test
	public void PR34() throws InterruptedException {
		goHome("juan@email.com");
		PO_NavView.clickOption(driver, "/chat/list");
		PO_ChatView.selectChatList(driver, 0);
		int oldNumber = PO_ChatView.getNumberMessages(driver);
		PO_ChatView.sendMessage(driver, "Hola buen amigo!");
		assertEquals(oldNumber + 1, PO_ChatView.getNumberMessages(driver));
	}

	//PR35. Mostrar el listado de conversaciones ya abiertas. Comprobar que el listado contiene las
	//conversaciones que deben ser
	@Test
	public void PR35() {
		goHome("juan@email.com");
		PO_NavView.clickOption(driver, "/chat/list");
		assertEquals(10, PO_ChatView.checkNumberList(driver));
		PO_ChatView.changePage(driver, 2);
		assertEquals(10, PO_ChatView.checkNumberList(driver));
	}

	//PR36. Sobre el listado de conversaciones ya abiertas. Pinchar el enlace Eliminar de la primera y
	//comprobar que el listado se actualiza correctamente.
	@Test
	public void PR36() {
		goHome("juan@email.com");
		PO_NavView.clickOption(driver, "/chat/list");
		PO_ChatView.deleteCharList(driver, 0);
		assertEquals(10, PO_ChatView.checkNumberList(driver));
		PO_ChatView.changePage(driver, 2);
		assertEquals(10, PO_ChatView.checkNumberList(driver));
	}

	//PR37. Sobre el listado de conversaciones ya abiertas. Pinchar el enlace Eliminar de la última y
	//comprobar que el listado se actualiza correctamente.
	@Test
	public void PR37() {
		goHome("juan@email.com");
		PO_NavView.clickOption(driver, "/chat/list");
		assertEquals(10, PO_ChatView.checkNumberList(driver));
		PO_ChatView.changePage(driver, 2);
		assertEquals(10, PO_ChatView.checkNumberList(driver));
		PO_ChatView.deleteCharList(driver, 9);
		assertEquals(10, PO_ChatView.checkNumberList(driver));
		PO_ChatView.changePage(driver, 2);
		assertEquals(9, PO_ChatView.checkNumberList(driver));
	}

	//PR38. Identificarse en la aplicación y enviar un mensaje a una oferta, validar que el mensaje enviado
	//aparece en el chat. Identificarse después con el usuario propietario de la oferta y validar que tiene un
	//mensaje sin leer, entrar en el chat y comprobar que el mensaje pasa a tener el estado leído.
	@Test
	public void PR38() {
		fail();
	}

	//PR39. Identificarse en la aplicación y enviar tres mensajes a una oferta, validar que los mensajes
	//enviados aparecen en el chat. Identificarse después con el usuario propietario de la oferta y validar que el
	//número de mensajes sin leer aparece en la en su oferta.
	@Test
	public void PR39() {
		fail();
	}

	/* ADICCIONALES */

	//PR40.  Registro de Usuario con datos inválidos (email vacío, nombre vacío, apellidos vacíos).
	@Test
	public void PR40() {
		PO_NavView.signup(driver);
		PO_RegisterView.fillForm(driver, "", "", "", "777777", "777777");
		assertEquals(1, PO_RegisterView.checkElement(driver, "class", "is-focused").size());
	}

	//PR41.  Inicio de sesión con datos válidos (administrador).
	@Test
	public void PR41() {
		String email = "admin@email.com";
		String password = "admin";
		PO_NavView.login(driver);
		PO_LoginView.fillForm(driver, email, password);
		PO_NavView.checkElement(driver, "id", "adminListMenu");
	}

	//PR42. Visualizar al menos cuatro páginas en Español/Inglés/Español (comprobando que algunas
	//de las etiquetas cambian al idioma correspondiente). Página principal/Opciones Principales de
	//Usuario/Listado de Usuarios de Admin/Vista de alta de Oferta.
	@Test
	public void PR42() {
		driver.get(URL + "/");
		PO_HomeView.checkKey(driver, "¿Eres nuevo?");
		PO_NavView.changeIdiom(driver, "btnEnglish");
		PO_HomeView.checkKey(driver, "Are you new?");
		goHome("juan@email.com", PO_Properties.getENGLISH());
		PO_NavView.changeIdiom(driver, "btnSpanish");
		PO_HomeView.checkKey(driver, "Bienvenid@");
		driver.get(URL + "/item/add");
		PO_HomeView.checkKey(driver, "producto");
		PO_NavView.changeIdiom(driver, "btnEnglish");
		PO_HomeView.checkKey(driver, "Add product");
		PO_NavView.logout(driver);
		String email = "admin@email.com";
		String password = "admin";
		PO_NavView.login(driver);
		PO_LoginView.fillForm(driver, email, password);
		driver.get(URL + "/admin/list");
		PO_HomeView.checkKey(driver, "Usuarios");
		PO_NavView.changeIdiom(driver, "btnEnglish");
		PO_HomeView.checkKey(driver, "Users");
	}

	//PR43. Intentar acceder sin estar autenticado a la opción de listado de usuarios del administrador. Se
	//deberá volver al formulario de login.
	@Test
	public void PR43() {
		driver.get(URL + "/admin/list");
		PO_LoginView.checkLoginPage(driver);
	}

	//PR44. Intentar acceder sin estar autenticado a la opción de listado de ofertas propias de un usuario
	//estándar. Se deberá volver al formulario de login.
	@Test
	public void PR44() {
		driver.get(URL + "/user/mylist");
		PO_LoginView.checkLoginPage(driver);
	}

	//PR45. Estando autenticado como usuario estándar intentar acceder a la opción de listado de
	//usuarios del administrador. Se deberá indicar un mensaje de acción prohibida.
	@Test
	public void PR45() {
		goHome("javier@email.com");
		driver.get(URL + "/admin/list");
		PO_ErrorView.checkError(driver, "403 - Forbidden");
	}

	/* AUXILIARES */

	private void goHome(String emailp) {
		goHome(emailp, PO_Properties.getSPANISH());
	}

	private void goHome(String emailp, int language) {
		driver.get(URL + "/");
		PO_NavView.login(driver);
		PO_LoginView.fillForm(driver, emailp, "123456");
		PO_HomeView.checkWelcome(driver, language);
	}

}