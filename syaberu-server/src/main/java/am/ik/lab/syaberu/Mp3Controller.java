package am.ik.lab.syaberu;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.RequestEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.Base64;

@RestController
@CrossOrigin
public class Mp3Controller {
    private final ApiKeyDecryptor apiKeyDecryptor;
    private final RestTemplate restTemplate;

    private final Logger log = LoggerFactory.getLogger(Mp3Controller.class);

    public Mp3Controller(ApiKeyDecryptor apiKeyDecryptor, RestTemplateBuilder builder) {
        this.apiKeyDecryptor = apiKeyDecryptor;
        this.restTemplate = builder
                .build();
    }

    @PostMapping(path = "syaberu.mp3")
    public byte[] syaberu(@RequestHeader(name = "X-Api-Key") String apiKey,
                          @RequestParam(name = "text") String text,
                          @RequestParam(name = "speaker", required = false, defaultValue = Syaberu.SHOW) String speaker,
                          @RequestParam(name = "emotion", required = false) String emotion) throws Exception {

        log.info("text: {}, speaker: {}, emotion: {}", text, speaker, emotion);
        final RequestEntity<LinkedMultiValueMap<String, String>> request = RequestEntity
                .post(URI.create("https://api.voicetext.jp/v1/tts"))
                .headers(httpHeaders -> httpHeaders.setBasicAuth(this.apiKeyDecryptor.decrypt(apiKey), ""))
                .body(new LinkedMultiValueMap<String, String>() {

                    {
                        final String speakerText = speaker.replace("\"", "").toLowerCase();
                        add("text", text);
                        add("speaker", speakerText);
                        if (!speakerText.equalsIgnoreCase(Syaberu.SHOW) && !StringUtils.isEmpty(emotion)) {
                            add("emotion", emotion.replace("\"", ""));
                        }
                        add("format", "mp3");
                    }
                });
        final byte[] body = restTemplate.exchange(request, byte[].class).getBody();
        return Base64.getEncoder().encode(body);
    }
}
