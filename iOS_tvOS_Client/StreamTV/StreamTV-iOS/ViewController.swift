//
//  ViewController.swift
//  StreamTV-iOS
//
//  Created by Bogdan Vitoc on 1/22/16.
//  Copyright © 2016 Bogdan Vitoc. All rights reserved.
//

import UIKit
import AVFoundation

class ViewController: UIViewController, AVCaptureVideoDataOutputSampleBufferDelegate {

    @IBOutlet weak var imageView: UIImageView!
    
    var captureSession: AVCaptureSession?
    var stillImageOutput: AVCaptureStillImageOutput?
    var previewLayer: AVCaptureVideoPreviewLayer?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Get tvOS data
//        DataReceiver.sharedReceiver.receiveImages { (image: UIImage?) -> Void in
//            self.imageView.image = image
//        }
        
//        let cameraDevice = AVCaptureDevice.defaultDeviceWithMediaType(AVMediaTypeVideo)
//        var inputDevice: AVCaptureDeviceInput?
//        do {
//            inputDevice = try AVCaptureDeviceInput(device: cameraDevice) as AVCaptureDeviceInput
//        } catch let error as NSError {
//            print(error)
//        }
//        
//        let outputDevice = AVCaptureVideoDataOutput()
//        outputDevice.setSampleBufferDelegate(self, queue: dispatch_get_main_queue())
//        
//        let captureSession = AVCaptureSession()
//        captureSession.addInput(inputDevice)
//        captureSession.addOutput(outputDevice)
//        
//        captureSession.startRunning()
     
        captureSession = AVCaptureSession()
        captureSession!.sessionPreset = AVCaptureSessionPresetPhoto
        
        let backCamera = AVCaptureDevice.defaultDeviceWithMediaType(AVMediaTypeVideo)
        
        var error: NSError?
        var input: AVCaptureDeviceInput!
        do {
            input = try AVCaptureDeviceInput(device: backCamera)
        } catch let error1 as NSError {
            error = error1
            input = nil
        }
        
        if error == nil && captureSession!.canAddInput(input) {
            captureSession!.addInput(input)
            
            stillImageOutput = AVCaptureStillImageOutput()
            stillImageOutput!.outputSettings = [AVVideoCodecKey: AVVideoCodecJPEG]
            if captureSession!.canAddOutput(stillImageOutput) {
                captureSession!.addOutput(stillImageOutput)
                
                previewLayer = AVCaptureVideoPreviewLayer(session: captureSession)
                previewLayer!.videoGravity = AVLayerVideoGravityResizeAspect
                previewLayer!.connection?.videoOrientation = AVCaptureVideoOrientation.Portrait
                view.layer.addSublayer(previewLayer!)
                
                captureSession!.startRunning()
            }
        }
    }

    func captureImage() {
        if let videoConnection = stillImageOutput!.connectionWithMediaType(AVMediaTypeVideo) {
            videoConnection.videoOrientation = AVCaptureVideoOrientation.Portrait
            stillImageOutput?.captureStillImageAsynchronouslyFromConnection(videoConnection, completionHandler: {(sampleBuffer, error) in
                if (sampleBuffer != nil) {
                    let imageData = AVCaptureStillImageOutput.jpegStillImageNSDataRepresentation(sampleBuffer)
                    let dataProvider = CGDataProviderCreateWithCFData(imageData)
                    let cgImageRef = CGImageCreateWithJPEGDataProvider(dataProvider, nil, true, CGColorRenderingIntent.RenderingIntentDefault)
                    
                    let image = UIImage(CGImage: cgImageRef!, scale: 1.0, orientation: UIImageOrientation.Right)
                    self.imageView.image = image
                }
            })
        }
    }
//    // Delegate routine that is called when a sample buffer was written
//    func captureOutput(captureOutput: AVCaptureOutput!, didOutputSampleBuffer sampleBuffer: CMSampletesPerRow(imageBuffer!)
//        let width = CVPixelBufferGetWidth(imageBuffer!)
//        let height = CVPixelBufferGetHeight(imageBuffer!)
//        let colorSpace = CGColorSpaceCreateDeviceRGB()
//        let bitmapInfo = CGBitmapInfo(rawValue: CGImageAlphaInfo.NoneSkipFirst.rawValue | CGBitmapInfo.ByteOrder32Little.rawValue)
//        let newContext = CGBitmapContextCreate(baseAddress, width, height, 8, bytesPerRow, colorSpace, bitmapInfo.rawValue)
//        let newCGImage = CGBitmapContextCreateImage(newContext)
//        CVPixelBufferUnlockBaseAddress(imageBuffer!, 0)
//        
//        return UIImage(CGImage: newCGImage!)
        
//        let imageData = AVCaptureStillImageOutput.jpegStillImageNSDataRepresentation(sampleBuffer)
//        let dataProvider = CGDataProviderCreateWithCFData(imageData)
//        let cgImageRef = CGImageCreateWithJPEGDataProvider(dataProvider, nil, true, CGColorRenderingIntent.RenderingIntentDefault)
//        return UIImage(CGImage: cgImageRef!, scale: 1.0, orientation: UIImageOrientation.Right)
//    }
}