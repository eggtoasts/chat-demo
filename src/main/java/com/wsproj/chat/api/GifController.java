package com.wsproj.chat.api;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

@Controller
@RequestMapping("/api/gifs")
public class GifController {
    @Value("${giphy.api.key}")
    private String giphyApiKey;


    //when user searches for a gif, giphy api will return 10 gif objects.
    @GetMapping("/search")
    public ResponseEntity<?> searchGifs(@RequestParam String q) {
        String url = "https://api.giphy.com/v1/gifs/search?api_key=" + giphyApiKey + "&q=" + q + "&limit=2";

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> giphyResponse = restTemplate.getForEntity(url, String.class);

        return ResponseEntity.ok(giphyResponse.getBody());
    }
}
