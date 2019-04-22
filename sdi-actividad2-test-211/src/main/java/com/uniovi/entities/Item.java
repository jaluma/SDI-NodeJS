package com.uniovi.entities;

import org.apache.commons.math3.util.Precision;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.logging.SimpleFormatter;

@Document(collection = "items")
public class Item {
	@Id
	private ObjectId _id;

	private String title;
	private String description;

	private String date;

	private double price;
	private boolean highlighter = false;

	private User sellerUser;
	private User buyerUser;

	@Transient
	private Date dateFormat;

	public Item(String title, String description, Date date, double price) {
		setTitle(title);
		setDescription(description);
		setDate(date);
		setPrice(price);
	}

	public Item() {
	}

	public String getId() {
		return _id.toHexString();
	}

	public void setId(ObjectId id) {
		this._id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getDate() {
		return dateFormat;
	}

	private void setDate(Date date) {
		this.dateFormat = date;

		this.date = new SimpleDateFormat("yyyy-MM-dd").format(date);
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = Precision.round(price, 2);
	}

	public User getSellerUser() {
		return sellerUser;
	}

	void setSellerUser(User user) {
		this.sellerUser = user;
	}

	public User getBuyerUser() {
		return buyerUser;
	}

	void setBuyerUser(User buyerUser) {
		this.buyerUser = buyerUser;
	}

	public boolean isHighlighter() {
		return highlighter;
	}

	public void setHighlighter(boolean highlighter) {
		this.highlighter = highlighter;
	}

	private Date asDate(LocalDate localDate) {
		return Date.from(localDate.atStartOfDay().atZone(ZoneId.systemDefault()).toInstant());
	}

	@Override
	public boolean equals(Object o) {
		if(this == o)
			return true;
		if(o == null || getClass() != o.getClass())
			return false;
		Item item = (Item) o;
		return Double.compare(item.price, price) == 0 && item.title != null && title.equals(item.title) && item.description != null && description.equals(item.description);
	}

	@Override
	public int hashCode() {
		return Objects.hash(title, description, date);
	}
}
