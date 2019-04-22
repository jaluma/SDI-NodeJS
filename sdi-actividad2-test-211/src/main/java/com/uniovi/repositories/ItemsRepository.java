package com.uniovi.repositories;

import com.uniovi.entities.Item;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ItemsRepository extends MongoRepository<Item, String > {

}