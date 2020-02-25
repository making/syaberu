# Syaberu

A proxy server for [VoiceText Web API](https://cloud.voicetext.jp/webapi).

```
curl localhost:8080 -H "X-Api-Key: ****" -d text=10:30になりました。スタンドアプミーティングを終了してください。
curl localhost:8080 -H "X-Api-Key: ****" -d text=ビルドが失敗しました。直してください 。 -d speaker=hikari -d emotion=sadness
curl localhost:8080 -H "X-Api-Key: ****" -d text=18:00になりました。帰宅の準備をしてください。 -d speaker=haruka -d emotion=happiness
```

Call API via RSocket Proxy

```
# build
./mvnw clean package -Dmaven.test.skip=true

java -jar target/syaberu-0.0.1-SNAPSHOT.jar --syaberu.proxy-uri=https://syaberu-rsocket-proxy.cfapps.io:8443/rsocket --syaberu.proxy-subscribe-id=foo 

curl https://syaberu-rsocket-proxy.cfapps.io:8443/proxy/foo -H "X-Api-Key: ****" -d text=10:30になりました。スタンドアプミーティングを終了してください。
```