package am.ik.lab.syaberu;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

@RestController
public class SyaberuController {
    public static final String SHOW = "SHOW";

    @GetMapping(path = "/")
    public ResponseEntity<?> redirect() {
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .header(HttpHeaders.LOCATION, "/index.html")
                .build();
    }

    @PostMapping(path = "/")
    public CompletableFuture<?> syaberu(@RequestHeader(name = "X-Api-Key") String apiKey,
                                        @RequestParam(name = "text") String text,
                                        @RequestParam(name = "speaker", required = false, defaultValue = Syaberu.SHOW) String speaker,
                                        @RequestParam(name = "emotion", required = false) String emotion) throws Exception {
        return Syaberu.speak(apiKey, text, speaker, emotion);
    }
}
