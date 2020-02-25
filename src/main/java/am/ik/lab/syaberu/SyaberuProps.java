package am.ik.lab.syaberu;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.ConstructorBinding;

import java.net.URI;

@ConfigurationProperties(prefix = "syaberu")
public class SyaberuProps {
    private final URI proxyUri;
    private final String proxySubscribeId;

    @ConstructorBinding
    public SyaberuProps(URI proxyUri, String proxySubscribeId) {
        this.proxyUri = proxyUri;
        this.proxySubscribeId = proxySubscribeId;
    }

    public URI getProxyUri() {
        return proxyUri;
    }

    public String getProxySubscribeId() {
        return proxySubscribeId;
    }
}
