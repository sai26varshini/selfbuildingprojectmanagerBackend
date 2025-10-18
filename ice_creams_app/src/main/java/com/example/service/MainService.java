package com.example.service;

import com.example.model.IceCream;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MainService {

    public List<IceCream> getAllIceCreams() {
        List<IceCream> iceCreams = new ArrayList<>();
        iceCreams.add(new IceCream("Vanilla", 5.99));
        iceCreams.add(new IceCream("Chocolate", 6.99));
        iceCreams.add(new IceCream("Strawberry", 7.99));
        return iceCreams;
    }

    public IceCream getIceCreamById(int id) {
        // Assuming id is a unique identifier for each ice cream
        // For simplicity, we'll just return the first ice cream
        return getAllIceCreams().get(0);
    }
}
