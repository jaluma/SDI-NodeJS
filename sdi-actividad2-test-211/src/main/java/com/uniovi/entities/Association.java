package com.uniovi.entities;

public class Association {

	public static class Buy {
		public static void link(User user, Item item) {
			item.setBuyerUser(user);
		}

		public static void unlink(Item item) {
			item.setBuyerUser(null);
		}
	}

	public static class Sell {
		public static void link(User user, Item item) {
			item.setSellerUser(user);
		}

		public static void unlink(Item item) {
			item.setSellerUser(null);
		}
	}

	public static class Chats {
		static void createChat(Chat chat, Item item) {
			chat.setItem(item);
		}

		public static void removeChat(Chat chat) {
			chat.setItem(null);
		}

		public static void sendMessage(User sender, Chat chat, Message message) {
			message.setUser(sender);
			chat._getMessages().add(message);
		}

		public static void removeMessage(User sender, Chat chat, Message message) {
			chat._getMessages().remove(message);
			message.setUser(null);
		}

		public static void removeMessages(Chat chat) {
			for(Message message : chat._getMessages()) {
				message.setUser(null);
			}
			chat._getMessages().clear();
		}
	}
}
