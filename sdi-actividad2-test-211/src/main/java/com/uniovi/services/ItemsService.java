package com.uniovi.services;

import com.uniovi.entities.Item;
import com.uniovi.repositories.ItemsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ItemsService {
	private final ItemsRepository itemsRepository;
	@Autowired
	public ItemsService(ItemsRepository itemsRepository) {
		this.itemsRepository = itemsRepository;
	}

	public void deleteAll() {
		itemsRepository.deleteAll();
	}

	void addAll(Iterable<Item> itemsList) {
		itemsRepository.saveAll(itemsList);
	}
}
