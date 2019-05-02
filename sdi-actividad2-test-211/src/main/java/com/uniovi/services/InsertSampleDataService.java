package com.uniovi.services;

import com.mifmif.common.regex.Generex;
import com.uniovi.entities.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.apache.commons.codec.binary.Base64;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@Transactional
public class InsertSampleDataService {
	private final UsersService usersService;
	private final RolesService rolesService;
	private final ChatsService chatsService;
	private final MessagesService messagesService;
	private final ItemsService itemsService;

	private List<Chat> chatList = new ArrayList<>();
	private List<Message> messagesList = new ArrayList<>();
	private List<Item> itemsList = new ArrayList<>();
	private List<User> usersList = new ArrayList<>();
	private LocalDateTime time = LocalDateTime.now().minus(1, ChronoUnit.DAYS);

	@Autowired
	public InsertSampleDataService(UsersService usersService, RolesService rolesService, ChatsService chatsService, MessagesService messagesService, ItemsService itemsService) {
		this.usersService = usersService;
		this.rolesService = rolesService;
		this.chatsService = chatsService;
		this.messagesService = messagesService;
		this.itemsService = itemsService;
	}

	//	@PostConstruct
	public void init() {
		// admin
		User admin = createUser("admin@email.com", "Admin", "Admin", "admin", rolesService.getRoles()[1], 100);

		// user 1
		User user1 = createUser("javier@email.com", "Javier", "Martinez");
		Item item1 = createItem(user1, "Cadena de musica", "Reproductor de musica", 100, true);
		Item item2 = createItem(user1, "Gorra", "De FA.", 30.59, false);
		Item item3 = createItem(user1, "Silla", "Silla gaming de alta calidad", 100.99, false);

		// user 2
		User user2 = createUser("juan@email.com", "Juán", "Mayo");
		List<Item> items2 = generateItems(user2);
		// user 3
		User user3 = createUser("benjamin@email.com", "Benjamin", "Cuellas", rolesService.getRoles()[0], 19.99);
		List<Item> items3 = generateItems(user3);
		// user 4
		User user4 = createUser("pedro@email.com", "Pedro", "Manrrique");
		List<Item> items4 = generateItems(user4);

		// compras
		buy(user1, items2.get(0));
		buy(user1, items3.get(0));

		buy(user2, items3.get(1));
		buy(user2, items4.get(1));

		buy(user3, items4.get(2));
		buy(user3, items2.get(2));

		buy(user4, items3.get(3));
		buy(user4, items4.get(3));

		usersService.addAll(usersList);
		itemsService.addAll(itemsList);
		usersList.clear();
		itemsList.clear();

		for(User user : Arrays.asList(user1, user2, user3, user4)) {
			createChats(user, user2, items2);
			createChats(user, user3, items3);
			createChats(user, user4, items4);
		}

		messagesService.addAll(messagesList);
		chatsService.addAll(chatList);

		//generamos valores para tener 20 usuarios registrados
		String[] names = new String[]{"Maria", "Cristina", "Elena", "Ivan", "Pedro", "Fernando"};
		String[] lastnames = new String[]{"Perez", "Garcia", "Fernandez", "Alvarez", "Rodriguez"};

		Random rd = new Random();

		for(int i = 0; i < 15; i++) {
			String email = new Generex("\\w{5}\\@email\\.es").random();
			String name = names[rd.nextInt(names.length)];
			String lastname = lastnames[rd.nextInt(lastnames.length)];

			createUser(email, name, lastname);
		}

		usersService.addAll(usersList);
	}

	private void createChat(Item item1, User user1) {
		Chat chat = new Chat(item1);

		String message11 = "Hola " + item1.getSellerUser().getName();
		String message12 = "Buenas tardes " + user1.getFullName() + " :)";

		String message21 = "Me interesa mucho este producto: " + chat.getItem().getTitle();
		String message22 = user1.getFullName() + ", esta a la venta. Solo tienes que compralo.";

		createConversation(user1, item1.getSellerUser(), chat, message11, message12);
		createConversation(user1, item1.getSellerUser(), chat, message21, message22);

		chatList.add(chat);
	}

	private void createConversation(User user1, User user2, Chat chat, String send, String receive) {
		Message message1 = new Message(send, getTime());
		message1.setRead(true);
		Association.Chats.sendMessage(user1, chat, message1);
		messagesList.add(message1);

		Message message2 = new Message(receive, getTime());
		Association.Chats.sendMessage(user2, chat, message2);
		messagesList.add(message2);
	}

	/* AUXILIARES */

	private LocalDateTime getTime() {
		return time = time.plus(30, ChronoUnit.SECONDS);
	}

	public void buy(User buyerUser, Item item) {
		Association.Buy.link(buyerUser, item);
	}

	private List<Item> generateItems(User user) {
		List<Item> list = new ArrayList<>();
		for(int j = 0; j < 4; j++) {
			list.add(createItem(user, "Producto " + (j + 1) + " de User " + user.getFullName(), "Descripcion de Producto " + (j + 1), Math.random() * 100, false));
		}
		return list;
	}

	private User createUser(String email, String name, String lastname, String password, String role, double money) {
		User user = new User(email, name, lastname);
		user.setPassword(password);
		user.setMoney(money);
		user.setRole(role);
		usersService.encryptPassword(user);
		usersList.add(user);
		return user;
	}

	private User createUser(String email, String name, String lastname, String role, double money) {
		return createUser(email, name, lastname, "123456", role, money);
	}

	private User createUser(String email, String name, String lastname) {
		return createUser(email, name, lastname, rolesService.getRoles()[0], 100);
	}

	private Item createItem(User user, String title, String description, double money, boolean highlighter) {
		Item item = new Item(title, description, new Date(), money);
		item.setHighlighter(highlighter);
		Association.Sell.link(user, item);
		itemsList.add(item);
		return item;
	}

	private void createChats(User buyer, User seller, List<Item> items) {
		for(int j = 0; j < items.size() && !buyer.equals(seller); j++) {
			createChat(items.get(j), buyer);
		}
	}
}