package com.uniovi.repositories;

import com.uniovi.entities.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MessagesRepository extends MongoRepository<Message, String> {

}
