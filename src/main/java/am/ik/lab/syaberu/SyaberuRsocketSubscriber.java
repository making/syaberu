package am.ik.lab.syaberu;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.rsocket.AbstractRSocket;
import io.rsocket.Closeable;
import io.rsocket.Payload;
import io.rsocket.RSocket;
import io.rsocket.metadata.WellKnownMimeType;
import io.rsocket.util.DefaultPayload;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.messaging.rsocket.RSocketRequester;
import org.springframework.stereotype.Component;
import org.springframework.util.MimeType;
import reactor.core.publisher.Mono;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

@Component
public class SyaberuRsocketSubscriber implements ApplicationRunner {
    private final Mono<RSocketRequester> requesterMono;
    private final ObjectMapper objectMapper;

    public SyaberuRsocketSubscriber(SyaberuProps props, RSocketRequester.Builder builder, ObjectMapper objectMapper) {
        if (props.getProxyUri() != null) {
            this.requesterMono = builder
                    .rsocketFactory(clientRSocketFactory -> clientRSocketFactory.acceptor(this::subscriberRsocket))
                    .setupMetadata(routingMetadata("subscribe." + props.getProxySubscriptionId()), MimeType.valueOf(WellKnownMimeType.MESSAGE_RSOCKET_ROUTING.getString()))
                    .connectWebSocket(props.getProxyUri())
                    .log("connect");
        } else {
            this.requesterMono = Mono.empty();
        }
        this.objectMapper = objectMapper;
    }

    RSocket subscriberRsocket(RSocket sendingRSocket) {
        return new AbstractRSocket() {
            @Override
            public Mono<Payload> requestResponse(Payload payload) {
                try {
                    final JsonNode json = objectMapper.readValue(payload.getDataUtf8(), JsonNode.class);
                    final JsonNode apiKey = json.get("apiKey");
                    final JsonNode text = json.get("text");
                    final JsonNode speaker = json.get("speaker");
                    final JsonNode emotion = json.get("emotion");
                    return Mono.fromFuture(Syaberu.speak(apiKey.asText(),
                            text.asText(),
                            speaker == null ? null : speaker.asText(),
                            emotion == null ? null : emotion.asText()))
                            .thenReturn(DefaultPayload.create("Received"));
                } catch (Exception e) {
                    return Mono.error(e);
                }
            }
        };
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        this.requesterMono
                .map(RSocketRequester::rsocket)
                .flatMap(Closeable::onClose)
                .repeat()
                .retryBackoff(Long.MAX_VALUE, Duration.ofSeconds(5), Duration.ofMinutes(10))
                .log("subscribe")
                .subscribe();
    }

    /**
     * https://github.com/rsocket/rsocket/blob/master/Extensions/Routing.md
     */
    static ByteBuffer routingMetadata(String tag) {
        final byte[] bytes = tag.getBytes(StandardCharsets.UTF_8);
        final ByteBuffer buffer = ByteBuffer.allocate(1 + bytes.length);
        buffer.put((byte) bytes.length);
        buffer.put(bytes);
        buffer.flip();
        return buffer;
    }

}
