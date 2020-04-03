package am.ik.lab.syaberu;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.CompletableFuture;

@RestController
public class SyaberuController {
    public static final String SHOW = "SHOW";

    @PostMapping
    public CompletableFuture<?> syaberu(@RequestHeader(name = "X-Api-Key") String apiKey,
                                        @RequestParam(name = "text") String text,
                                        @RequestParam(name = "speaker", required = false, defaultValue = Syaberu.SHOW) String speaker,
                                        @RequestParam(name = "emotion", required = false) String emotion) throws Exception {
        return Syaberu.speak(apiKey, text, speaker, emotion);
    }
}
